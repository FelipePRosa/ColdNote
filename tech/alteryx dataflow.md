# Alteryx Dataflow

import pandas as pd
import requests
from requests.auth import HTTPBasicAuth
import pyodbc
import math
from itertools import islice
from functools import reduce
from ayx import Alteryx



class DatabaseHandler:
    def __init__(self, server, database, username, password, table_name, homolog=False):
        self.server = server
        self.database = database
        self.table_name = table_name
        if homolog:
            self.database += '-hom'
        self.conn_str = f'DRIVER={{SQL Server}};SERVER={self.server};DATABASE={self.database};UID={username};PWD={password}'
        self.conn = pyodbc.connect(self.conn_str)
        self.cursor = self.conn.cursor()
        self.set_index()
        self.set_columns()

    def rename_table(self, old_name, new_name):
        try:
            self.cursor.execute(f"IF OBJECT_ID('{old_name}', 'U') IS NOT NULL EXEC sp_rename '{old_name}', '{new_name}'")
            self.conn.commit()
        except pyodbc.Error:
            self.conn.rollback()

    def delete_table(self):
        try:
            self.cursor.execute(f"IF OBJECT_ID('{self.table_name}', 'U') IS NOT NULL DROP TABLE {self.table_name}")
            self.conn.commit()
        except pyodbc.Error:
            self.conn.rollback()

    def clear_table(self):
        try:
            self.cursor.execute(f"IF OBJECT_ID('{self.table_name}', 'U') IS NOT NULL DELETE FROM {self.table_name}")
            self.conn.commit()
        except pyodbc.Error:
            self.conn.rollback()

    def execute_query(self, query):
        try:
            self.cursor.execute(query)
            self.conn.commit()
        except pyodbc.Error as e:
            self.conn.rollback()
            print("Error occurred:", e)
    
    def read_query(self):
        query = f"SELECT * FROM {self.table_name}"
        try:
            db_df = pd.read_sql_query(query, self.conn)
            self.local_df = db_df
        except pyodbc.Error:
            self.conn.rollback()
        return db_df

    def update_database(self, input_df):
        
        self.input_df = input_df.fillna("").reset_index(drop=True)
        self.local_df = self.local_df.fillna("").reset_index(drop=True)
        
        combined_input = reduce(
            lambda x, y: x + '-' + y,
            [self.input_df[col].astype(str) for col in self.index_columns]
        )

        combined_local = reduce(
            lambda x, y: x + '-' + y,
            [self.local_df[col].astype(str) for col in self.index_columns]
        )
        
        # Step 1: Identify Removed Data
        self.removed_data = self.local_df[~combined_local.isin(combined_input)].astype(str)

        # Step 2: Identify Created Data
        self.created_data = self.input_df[~combined_input.isin(combined_local)].astype(str)
        
        # Step 3: Identify Changed Data
        
        # Merge the data on 'KUNNR' to compare rows with the same key
        merged_data = pd.merge(self.local_df, self.input_df, on=self.index_columns, suffixes=('_old', '_new'))
        
        # Identify '_old' and '_new' columns
        old_columns = [col for col in merged_data.columns if col.endswith('_old')]
        new_columns = [col.replace('_old', '_new') for col in old_columns]

        # Ensure old and new data are strings and strip whitespace
        old_data = merged_data[old_columns].astype(str).apply(lambda x: x.str.strip().str.strip("\u2060"))
        new_data = merged_data[new_columns].astype(str).apply(lambda x: x.str.strip().str.strip("\u2060"))
        
        # Create a boolean mask where any '_old' value is different from the corresponding '_new' value
        mask = (old_data.values != new_data.values).any(axis=1)

        # Filter the rows where changes were detected
        self.changed_data = merged_data[mask].astype(str)
        print(f"{len(self.changed_data)} rows to update")
        
        #self.remove_query()
        #self.insert_query()
        #self.update_query()
        return

    def remove_query(self):
        if self.removed_data.empty:
            print("No rows to remove.")
            return
        
        for _, row in self.removed_data.iterrows():
            conditions = " AND ".join([f"{col} = ?" for col in self.removed_data.columns])
            query = f"DELETE FROM {self.table_name} WHERE {conditions}"

            # Execute DELETE query
            with self.conn.cursor() as cursor:
                cursor.execute(query, tuple(row))
                self.conn.commit()
        print(f"Removed {len(self.removed_data)} rows from {self.table_name}.")
        
    def insert_query(self):
        if self.created_data.empty:
            print("No rows to include.")
            return

        columns = self.created_data.columns.tolist()
        placeholders = ", ".join(["?"] * len(columns))
        query = f"INSERT INTO {self.table_name} ({', '.join(columns)}) VALUES ({placeholders})"

        with self.conn.cursor() as cursor:
            for _, row in self.created_data.iterrows():
                cursor.execute(query, tuple(row))
            self.conn.commit()
        print(f"Included {len(self.created_data)} rows into {self.table_name}.")

    def update_query(self):
        if self.changed_data.empty:
            print("No rows to update.")
            return

        self.cursor.execute(f"DROP TABLE IF EXISTS temptable_{self.table_name}")
        self.conn.commit()


        with self.conn.cursor() as cursor:
            column_string = ',\n'.join([f"{col} VARCHAR(255)" for col in self.input_df.columns])

            temp_table_query = f"""
            CREATE TABLE temptable_{self.table_name} (
            {column_string}
            );
            """

            cursor.execute(temp_table_query)
            self.conn.commit()

            new_columns = [col for col in self.changed_data.columns if col.endswith('_new')]
            insert_string = ', '.join([col.replace('_new', '') for col in new_columns] + self.index_columns)
            placeholders = ', '.join(['?'] * (len(new_columns) + len(self.index_columns)))
            
            def batched(iterable, batch_size):
                """Generator that yields batches from an iterable."""
                iterator = iter(iterable)
                while True:
                    batch = list(islice(iterator, batch_size))
                    if not batch:
                        break
                    yield batch
            
            batch_size = 100

            data_to_insert = [tuple(row[new_columns].str.strip("\u2060")) + tuple(row[col] for col in self.index_columns) for _, row in self.changed_data.iterrows()]

            insert_query = f"INSERT INTO temptable_{self.table_name} ({insert_string}) VALUES ({placeholders});"

            total_batches = (len(data_to_insert) + batch_size - 1) // batch_size  # Calculate total batches
            print(f"Total Batches: {total_batches}")
            
            for batch_number, batch in enumerate(batched(data_to_insert, batch_size), start=1):
                print(f"Processing Batch {batch_number}/{total_batches} with {len(batch)} rows.")
                cursor.executemany(insert_query, batch)
                self.conn.commit()
            
            merge_string = ',\n'.join([f"Target.{col.replace('_new', '')} = Source.{col.replace('_new', '')}" for col in new_columns])
            unique_string = ' AND \n'.join([f"Target.{col} = Source.{col}" for col in self.index_columns])
            merge_index_string = ',\n'.join([f"Target.{col} = Source.{col}" for col in self.index_columns])
            
            merge_query = f"""
            MERGE INTO {self.table_name.upper()} AS Target
            USING temptable_{self.table_name} AS Source
            ON {unique_string}
            WHEN MATCHED THEN
            UPDATE SET {merge_index_string},
            {merge_string};
            """

            cursor.execute(merge_query)

            self.conn.commit()
            print(f"Updated {len(self.changed_data)} rows in {self.table_name}.")

            cursor.execute(f"DROP TABLE IF EXISTS temptable_{self.table_name}")
            self.conn.commit()
    
    def set_index(self):
        query = f"""SELECT
            i.name AS index_name,
            i.type_desc AS index_type,
            c.name AS column_name
        FROM
            sys.indexes i
            INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
            INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        WHERE
            OBJECT_NAME(i.object_id) = '{self.table_name.upper()}';
        """
        try:
            index_data = pd.read_sql_query(query, self.conn)
            self.index_columns = list(index_data[index_data['index_name'] == index_data['index_name'][0]]['column_name'])
        except pyodbc.Error:
            self.conn.rollback()
        return

    def set_columns(self):
        query = f"""SELECT
            c.name AS column_name
        FROM
            sys.columns c
        WHERE
            OBJECT_NAME(c.object_id) = '{self.table_name.upper()}';
        """
        try:
            columns_data = pd.read_sql_query(query, self.conn)
            self.columns = list(columns_data['column_name'])
        except pyodbc.Error:
            self.conn.rollback()
        return
    
    def close(self):
        self.cursor.close()
        self.conn.close()



class apiHandler:
    def __init__(self, db_handler, batch_size=5000):
        self.__username = "sap.alteryx"
        self.__password = "D7tc:xUL"     #prod = 'D7tc:xUL.B5id:mZh'

        self.base_url = "https://lambda.neodent.com.br/SapAlteryx/hom"
        self.db_handler = db_handler
        self.batch_size = batch_size

self.authenticate()

    def authenticate(self):
        self.__authentication = HTTPBasicAuth(self.__username, self.__password)

    def create(self):
        data = self.db_handler.created_data

        if len(data) == 0:
            print(f"No data to include")
            return
        
        for start in range(0, len(data), self.batch_size):
            end = start + self.batch_size
            batch = data.iloc[start:end].copy()

            batch = batch.fillna("").reset_index(drop=True)
            
            json={
                "table_name": self.db_handler.table_name,
                "data": batch.values.tolist()
            }
            response = requests.post(self.base_url+"/create", auth=self.__authentication, json=json)

        print(f"Finished including {len(data)} values")
        return

    def read(self, limit=1000, offset=1):
        params={
            "limit": limit,
            "offset": offset,
            "table_name": self.database
        }
        response = requests.get(self.base_url+"/get", auth=self.__authentication, params=params)
        return response.json()

    def update(self):
        ordered_columns = self.db_handler.local_df.columns.tolist()
        new_columns = [column for column in self.db_handler.changed_data.columns if '_old' not in column]
        data = self.db_handler.changed_data[new_columns]
        data = data.rename(columns={column: column.strip('_new') for column in new_columns})[ordered_columns]
        
        if len(data) == 0:
            print(f"No data to update")
            return
        
        for start in range(0, len(data), self.batch_size):
            end = start + self.batch_size
            batch = data.iloc[start:end].copy()

            batch = batch.fillna("").reset_index(drop=True)
            
            json={
                "table_name": self.db_handler.table_name,
                "data": batch.values.tolist()
            }
            response = requests.put(self.base_url+"/update", auth=self.__authentication, json=json)
            
        print(f"Finished updating {len(data)} values")
        return

    def delete(self):
        data = self.db_handler.removed_data
        
        if len(data) == 0:
            print(f"No data to remove")
            return False
        
        for start in range(0, len(data), self.batch_size):
            end = start + self.batch_size
            batch = data.iloc[start:end].copy()

            batch = batch.fillna("").reset_index(drop=True)
            
            json={
                "table_name": self.db_handler.table_name,
                "data": batch.values.tolist()
            }
            response = requests.delete(self.base_url+"/delete", auth=self.__authentication, json=json)
            
        print(f"Finished removing {len(data)} values")
        return

    def execute_batch(self, method, dataframe):
        for start in range(0, len(dataframe), self.batch_size):
            end = start + self.batch_size
            batch = dataframe.iloc[start:end].copy()

            batch = batch.fillna("").reset_index(drop=True)
            
            json={
                "table_name": self.database,
                "data": batch.values.tolist()
            }
            response = requests.post(self.base_url+f"/{method}", auth=self.__authentication, json=json)
            print(response.json())
        
        return



def main():
    table_name = 'boleto'
    environment = 'hom' #hom
    try:
        df = Alteryx.read("#1")
        df = df.drop_duplicates()
        can_read_dataset = True
    except:
        can_read_dataset = False
        
    if can_read_dataset:
        if environment =='hom':
            homolog = True
        else:
            homolog = False

        db_handler = DatabaseHandler(
            server='datalake-sql-smilink.database.windows.net',
            database='DATABASE',
            username='adminSmilink',
            password='Smilinkinha@2023',
            table_name = table_name,
            homolog=homolog
        )

# INCLUIR AQUI TRATAMENTOSDE DADOS NECSSÁRIOS
        
        # Database handle ------------------------
        db_handler.read_query()
        db_handler.update_database(df)
        
        sapAlteryx_handler = apiHandler(db_handler)
        sapAlteryx_handler.create()
        sapAlteryx_handler.delete()
        sapAlteryx_handler.update()
        
        db_handler.close()
        
        #Alteryx.write(db_handler.changed_data, 1)
    else:
        print('Unable to read data entry')



if __name__ == "__main__":
    main()