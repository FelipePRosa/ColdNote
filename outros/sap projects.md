# SAP Projects

1. Criação de cotação e pedido (Em andamento)
  Motivo: Estamos trabalhando em features alinhadas com LT de recompra
\---> Alteração dos endpoints de cotação e criação de pedido para comportar cupons e outros tópicos necessários

2. CRUD métodos de pagamento
  Motivo: Muitos clientes querem trocar o método de pagamento. Com o aumento das vendas no aplicativo e potencialmente nos demais canais, devemos disponibilizar uma forma do cliente ter essa liberdade para facilitar suas compras.
\---> Endpoint de leitura, criação e exclusão de método de pagamento

3. API lista de itens + estoque + valor (equivalente ao eshop)
  Motivo: Hoje estamos trabalhando com uma lista fixa de produtos. isso significa que a cada alteração / adição / remoção de produtos, as bases ficarão desatualizadas até intervenção manual. Esse era um tema que já estava em andamento com o Jean. Se trata de uma comunicação que traz basicamente as informações de produtos que estão no eshop: Lista de itens, informações dos itens, estoque, hierarquia de família do item, etc.
\---> Endpoint de busca de lista de itens por familia hierarquia 
\---> Endpoint de busca de informações gerais de item

4. Boletos faturados
  Motivo: Analisando os pedidos atuais dos clientes, muitos tem o interesse de ter o feedback completo de suas finanças, hoje estamos apenas com a capacidade de trazer os boletos em aberto. É um pedido recorrente da base de clientes 
\---> Criar endpoint para buscar boletos fechados, ou analisar possível fluxo de atualização D-1 para abastecer DB com boletos pagos (necessário regras de negócio)

5. Faturamentos gerais (crédito / pix / débito / dinheiro / etc.)
  Motivo: Seguindo a linha do item 4, os clientes pedem e têm a necessidade do acompanhamento financeiro completo.
\---> Semelhante ao item 4

6. Melhoria no endpoint de dados CRM
  Motivo: Atualmente os dados enviados para pesquisa de CSAT não contém a informação necessária para vincular o registro com o envio
\---> Atualizar o endpoint com informação necessária para que possamos identificar o crm number do cliente (e.g.: adicionar cpf no retorno do endpoint)

7. Pedidos -> Clear + Consignado + ZSEB
  Motivo: O rastreio de pedidos é limitado a produtos Neodent/Straumann BR hoje. Isso se dá por causa dos diferentes campos e variáveis envolvidas nesses diferentes tópicos.
\---> Estudar e adequar o webhook, ou criar novos que contemplam Clear / Consignado / ZSEB

8. Pedidos LATAM
  Motivo: Hoje o rastreio que temos serve apenas para os pedidos BR. Pensando na expansão não só dosserviços atuais, mas como implementação de novas funcionalidades no WA Latam, um método de rastreio semelhante ao que fizamos para o BR serviria perfeitamente
\---> Replicaro webhook de rastreio de pedidos para LATAM

9. APIs boletos
  Motivo: Com os acordos e negociações, vários clientes estão se deparando com uma situação irreal ao conferir os boletos nas plataformas. Isso se dá ao fato de que os boletos são atualizados 1 vês ao dia. Com uma porta de comunicação mais direta e atualziada como um endpoint, poderiamos contornar esse problema. (Esse item já foi semi resolvido com um novo fluxo de dados)
\---> Endpoint de retorno dos boletos dos clientes

10. Bloqueio ZSEB
  Motivo: Alguns pedidos precisam de alteração, portanto seria importante criar o pedido em estado bloqueado caso uma variável de bloqueio for passada
      \---> Alterar endpoint e incluir variável

11. Cálculo completo de cotação e compra
  Motivo: As integrações de compra não estão performando bem / como esperado. A melhor solução sera tratar como foi feito nos boletos e realizaros cálculos externamente ao SAP
      \---> Extração completa e regras de aplicação de preço / desconto de um carrinho pré configurado

12. Alteração do job de envio de rastreio (Andamento)
  Motivo: Um valor hard code está limitando as informações que recebemos do SAP
      \---> Alterar job em execução

13. Conciliação de pagamentos
  Motivo: Estamos começando o planejamento para um projeto de pagamento de pendencias por checkout page
      \---> API de conciliação de pagamento