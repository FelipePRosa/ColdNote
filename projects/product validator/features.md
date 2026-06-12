# Features - product validator

_Liste aqui features, capacidades e entregas importantes deste projeto._

## Extração e análise dos produtos
Extrair a tabela de produtos da Neodent/Straumann e fazer uma análise de regras:

Campo Alvo (Onde)	Condição de Ativação (Gatilho)	Regra de Validação
Geral (Filtro)	Coluna P = "DC", "VC" ou "UC"	EXCLUIR: Não processar nenhuma regra para este material.
EAN (Col. T)	Coluna I IN ("FERT", "ZERT", "ZKUR")	Obrigatório (Não nulo).
Pesos (Col. V/W)	Coluna I IN ("FERT", "ZERT", "ZKUR", "ZAWA", "HAWA")	Valor numérico > 0.
Lote (Col. AX)	Coluna I NOT IN ("DIEN", "ZLAB", "ZLAG", "VERP", "ZMAR", "ZPMS", "ZSON")	Obrigatório (Não nulo).
NCM (Col. AO)	Todos os materiais	Diferente de vazio AND NOT IN ("0000.00.00", "9900.00.00").
Fiscal (Col. AG)	Coluna D = "4400"	Valor fixo = "1".
Contábil (Col. AJ)	Coluna D = "4400"	Valor IN ("D1", "D2").
CFOP (Col. AQ)	Coluna B LIKE "44%"	Valor fixo = "0".
Ledger (Col. CI)	Coluna I NOT IN ("DIEN", "ZMAR", "ZLAG", "ZLAB", "VERP")	Valor fixo = "X".
Utilização e Origem (CJ/CH)	Todos os materiais	Ambos os campos devem ser > 0.
Texto Longo	Coluna I IN ("FERT", "ZERT", "ZKUR", "HAWA")	Obrigatório preenchimento (Colunas DT até DZ).
Centro Lucro (Col. AL)	Coluna L termina com "13"	Prioridade 1: Deve ser igual a P500.
Centro Lucro (Col. AL)	Coluna B IN ("4401", "4400")	Prioridade 2: Se não for Lab (*13), deve ser P140.
Centro Lucro (Col. AL)	Coluna B começa com "44"	Prioridade 3: Se não for Lab (*13) nem 4400/4401, deve ser P130.
Custo Std (CP)	Coluna P IN ("DE", "VE", "UE")	Valor decimal > 0,01.
Texto Curto	Coluna CY NOT IN ("NOPLM", "")	Obrigatório preencher todos os idiomas (Colunas CZ até DF).
