# AGENTS.md - Voucher Parceria

## Visao Geral

Este repositorio automatiza a geracao de vouchers de parceria no SAP a partir de uma fila no
Azure SQL. A implementacao foi reestruturada para uma arquitetura em camadas, com separacao
entre dominio, infraestrutura, interface e configuracao centralizada.

O objetivo da base atual e permitir evolucao segura, testes focados na regra de negocio,
substituicao de integracoes com menor acoplamento e operacao previsivel em ambiente Windows.

## Estrutura Atual

```text
Voucher Parceria/
|-- src/
|   |-- config.py
|   |-- main.py
|   |-- endpoint/
|   |   |-- main.py
|   |   `-- routes/robot_cli.py
|   |-- domain/
|   |   |-- contracts.py
|   |   |-- objects/voucher_models.py
|   |   |-- operations/voucher_validation_operations.py
|   |   `-- commands/process_voucher_commands.py
|   `-- core/
|       |-- runtime/logging.py
|       |-- services/
|       |   |-- auxiliary_workbook_service.py
|       |   |-- outlook_email_service.py
|       |   `-- sap_coupon_service.py
|       `-- voucher/adapters/sql_server.py
|-- tests/
|   |-- unit/domain/test_voucher_validation_operations.py
|   `-- unit/domain/test_process_voucher_commands.py
|-- dist/
|   `-- robo_parcerias/
|       |-- robo_parcerias.exe
|       |-- AuxiliarRobo.xlsx
|       |-- .env
|       `-- _internal/
|-- docs/architecture.md
|-- robo_parcerias.py
|-- robo_parcerias_email.py
|-- auto_robo_parcerias.ps1
|-- iniciar_auto_robo.bat
|-- AuxiliarRobo.xlsx
`-- python_architecture_standard.docx
```

## Camadas

### `src/domain`

Camada interna e pura.

- `objects`: modelos imutaveis como `VoucherRequest`, `ProcessedVoucher` e `VoucherStatus`
- `operations`: regras puras de validacao e normalizacao
- `commands`: orquestracao do caso de uso de processamento de voucher
- `contracts.py`: contratos de repositorio, SAP, workbook e notificacao

Regra: o dominio nao conhece `pymssql`, `openpyxl`, `win32com` ou detalhes de ambiente.

### `src/core`

Camada de infraestrutura e adaptadores.

- `voucher/adapters/sql_server.py`: leitura e persistencia na tabela `Voucher_Data`
- `services/sap_coupon_service.py`: automacao SAP GUI, recovery, watchdog e fallback de login
- `services/outlook_email_service.py`: envio de notificacoes via Outlook
- `services/auxiliary_workbook_service.py`: leitura da planilha auxiliar
- `runtime/logging.py`: logging de console e arquivo

### `src/endpoint`

Camada de interface e bootstrap do fluxo.

- `endpoint/main.py`: monta dependencias e executa o processamento
- `endpoint/routes/robot_cli.py`: parser CLI

### `src/config.py`

Fonte unica de configuracao via variaveis de ambiente e `.env`.

## Fluxo de Execucao

1. O entrypoint carrega configuracoes e inicializa logging.
2. O repositorio busca registros pendentes em `dbo.Voucher_Data`.
3. O comando de dominio valida codigo do dentista e codigo do caso.
4. O comando consulta duplicidade no banco e na planilha auxiliar.
5. O adaptador SAP tenta reutilizar uma sessao existente ou abrir uma nova conexao.
6. Quando a regra permite, o adaptador SAP cria o voucher em `ZSD_COUPON`.
7. O repositorio persiste status final e campos de retorno.
8. O servico de Outlook envia notificacao quando habilitado.

## SAP Recovery

O fluxo SAP atual suporta dois cenarios operacionais:

- SSO, usando a conexao configurada em `SAP_CONNECTION_NAME`
- login manual, usando `SAP_CLIENT`, `SAP_USERNAME` e `SAP_PASSWORD`

Comportamento atual:

- tenta reutilizar sessao SAP ja existente
- tenta abrir a conexao configurada via SAP Logon quando necessario
- se encontrar tela de login, preenche credenciais explicitas quando configuradas
- monitora popup de erro do `saplogon.exe`
- reinicia o SAP Logon em erros restartables
- aplica watchdog para evitar hang indefinido durante o recovery
- quando a sessao SAP permanece indisponivel, deixa as linhas pendentes para o proximo ciclo

Conexoes usuais observadas no ambiente:

- `s10   P11   ERP-Prod`: SSO
- `n10   P11   ERP-Prod`: login manual

## Entry Points

### Novo entrypoint principal

```powershell
python -m src.main
```

### Wrapper sem e-mail

```powershell
python robo_parcerias.py
```

### Wrapper com e-mail

```powershell
python robo_parcerias_email.py
```

Os wrappers da raiz foram mantidos para compatibilidade operacional e delegam para `src.main`.

## Configuracao

Use `.env.example` como referencia para criar um `.env` local com:

- conexao SQL
- labels de status
- configuracao SAP
- parametros de notificacao
- caminho da planilha auxiliar

Observacoes:

- o executavel empacotado le `.env` no diretorio do `.exe`
- para operacao padrao, manter `.env` tambem em `dist\robo_parcerias`
- a planilha `AuxiliarRobo.xlsx` precisa estar acessivel ao lado do executavel empacotado

## Dependencias

Dependencias de runtime declaradas em `pyproject.toml`:

- `pymssql`
- `openpyxl`
- `pywin32`
- `python-dateutil`

## Requisitos Operacionais

- Windows com SAP GUI for Windows instalado
- SAP GUI scripting habilitado
- acesso ao ambiente SAP configurado no SAP Logon
- VPN/rede corporativa estavel para o message server SAP
- acesso de rede liberado para o Azure SQL
- presenca da planilha `AuxiliarRobo.xlsx`
- Outlook configurado se notificacoes estiverem habilitadas

## Logging

O logging atual foi ajustado para acompanhamento em terminal:

- console com layout compacto para hora, nivel, modulo e mensagem
- arquivo `robo_parcerias_runtime.log` ao lado do executavel ou no diretorio corrente em desenvolvimento
- resumo por execucao com:
  - total
  - generated
  - repeated
  - sap_error
  - deferred
  - duration
  - rate por minuto

O supervisor PowerShell registra:

- estado da fila
- estado do processo
- pid lancado
- ultimo resumo do runtime

## Auto Runner

`auto_robo_parcerias.ps1` continua sendo o supervisor local do robo operacional. Ele:

- mantem a maquina acordada
- consulta a fila no SQL
- inicia o executavel quando houver demanda
- registra o comportamento em log
- roda por tempo indeterminado por padrao
- permite limite de tempo apenas quando `MaxHours > 0`
- usa por padrao `dist\robo_parcerias\robo_parcerias.exe`
- depende da estrutura `PyInstaller --onedir` completa dentro de `dist\robo_parcerias`

## Pipeline

O repositorio possui pipeline em `azure-pipelines.yml` com trigger em `main` para:

- instalar dependencias
- executar testes unitarios de dominio
- gerar o executavel com `PyInstaller`
- publicar o pacote operacional do robo

## Validacao Aplicada

Foi executado durante a revalidacao:

- testes unitarios da camada de dominio
- validacao AST dos arquivos Python
- revisao da separacao arquitetural contra `python_architecture_standard.docx`
- validacao operacional dos logs, recovery SAP e empacotamento em `dist`

## Limites e Observacoes

- o ambiente SAP ainda pode falhar por problemas externos de SSO, VPN ou message server
- erros como `rc=9` e `Sapgui Component could not be instantiated` sao tratados como indisponibilidade de sessao e nao devem travar o processo por horas
- o `.env` contem credenciais operacionais e nao deve ser versionado
