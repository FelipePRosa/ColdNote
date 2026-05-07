# project notes

## Notes
A leitura integrada dos quatro relatórios aponta para uma explicação em camadas: abril caiu por um efeito real de volume/atividade, não por sazonalidade normal; parte desse efeito parece ligada a compras grandes anteriores, mas a queda também tem forte componente comercial/geográfico e de perda de compradores ativos.

Síntese
AbrAtual fechou em 47,8M, contra 77,6M em março, queda de 29,8M ou -38,4%. Contra abril/2025, a queda foi de 15,6M ou -24,6%. O volume de implantes caiu ainda mais forte: 235.321 em março para 132.308 em abril, -43,8%.

Pela sazonalidade, abril normalmente não deveria cair assim. Em 2025, março para abril ficou praticamente estável: -0,5% em vendas e -1,4% em implantes. Então abril/2026 teve uma ruptura fora do padrão sazonal.

O principal motor da queda
A maior parte da queda veio de clientes que compraram em março e não voltaram em abril:

Compradores perdidos de março: impacto de -33,7M.
Compradores retidos, mas com menor compra: -13,9M.
Novos compradores em abril compensaram +17,7M.
Ou seja, abril não caiu só porque quem comprou comprou menos; caiu principalmente porque muitos clientes ativos em março não tiveram compra positiva em abril.

Relação com compras grandes anteriores
A análise de cadência reforça a hipótese de compras concentradas antes de abril.

Clientes com compra muito grande P90+ tiveram alta probabilidade de não comprar em abril:

Mês da compra P90+	P sem compra em abril	P sem nenhuma compra até abril
Dez/2025	62,0%	27,7%
Jan/2026	59,1%	31,1%
Fev/2026	61,3%	40,2%
Mar/2026	60,9%	60,9%
A leitura mais forte é para fevereiro e março. Clientes que fizeram compras muito grandes nesses meses tiveram grande chance de não recomprar até abril. Isso sugere efeito de antecipação, estoque ou ciclo de reposição.

Mas isso não explica tudo sozinho: em dezembro e janeiro, muitos clientes P90+ não compraram em abril, mas compraram em algum mês intermediário. Então o efeito existe, mas é mais forte quando a compra grande aconteceu perto de abril.

Onde a queda concentrou
Por classificação, os maiores impactos sequenciais foram:

KA: -8,6M
Ativo A: -7,9M
Ativo B: -7,2M
Ativo C: -5,8M
Ativo D: -4,5M
Ativo D concentra muitos clientes perdidos em quantidade, mas KA, Ativo A e Ativo B concentram maior impacto por cliente.

Por atendimento, o impacto principal foi em ACE: -33,5M vs março.
Por região, os maiores impactos foram SUL, CONNE, SUDESTE e SÃO PAULO.

O modelo de variáveis confirma essa leitura
No modelo de impacto para AbrAtual, as variáveis mais relevantes foram:

- Estado
- ultdata
- PotencialNetSales
- Mes
- Classificacao
- SuperCoord
- FilialDesc
- histórico de vendas e implantes anteriores

Isso indica que abril não foi afetado só por uma dinâmica mensal. O impacto tem relação com localização, estrutura comercial, classificação/potencial do cliente, recência de atividade e histórico de compra.

Conclusão
A queda de abril parece ser resultado de três fatores combinados:

1. Queda anormal de volume, principalmente implantes, fora do padrão sazonal.
2. Compras grandes anteriores, especialmente em fevereiro e março, reduzindo recompra em abril.
3. Perda de compradores ativos, concentrada em ACE, KA/Ativos e algumas regiões/equipes.
A próxima análise mais útil seria montar uma lista priorizada de clientes que: compraram P90+ em Fev/Mar, não compraram em abril, tinham alto potencial ou classificação KA/Ativo A/B/C, e pertencem às regionais/representantes com maior queda. Isso vira uma lista prática de recuperação comercial.
