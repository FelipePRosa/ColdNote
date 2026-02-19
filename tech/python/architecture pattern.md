# Architecture Pattern

Lambda names -> snake_case

projeto_functionality

E.g.: 
generic_send_email
neoapp_genia_voice

## Suggested Structure
```text
src/
|-- __init__.py
|-- config.py                  # Project settings (keys, env vars, etc.)
|-- main.py                    # Entry point for AWS Lambda or main execution
|
|-- api/ 
|   |-- __init__.py
|   |-- main.py                # FastAPI app
|   |-- utils.py               # APIs utils
|   `-- routes/
|       `-- __init__.py
|
|-- core/
|   |-- mew/
|   |   |--generate.py
|   |   |--jobs.py
|   |   |--config.py
|   |   |--core.py
|   |   `--arbok                # Database connection (singleton/pool)
|   |       |--odbc.py
|   |       `--mongo.py
|   |
|   |-- services/              # External services
|   |   |-- __init__.py
|   |   |-- openai_service.py    # Example
|   |   `-- pagarme_service.py   # Example
|   |
|   `-- utils/                 # Helper functions
|       |-- __init__.py
|       |-- notations.py      # Example
|       `-- helpers.py        # Example
|
|-- domain/                   # Business logic       
|   |-- application/          #business/application logic
|   |   |-- __init__.py
|   |   |-- balance_operation.py   # Example
|   |   |-- payment.py             # Example
|   |   |-- notification.py        # Example
|   |   `-- installments.py        # Example
|   |
|   |-- models/               # Domain models
|   |   |-- __init__.py
|   |   |-- payment_model.py       # Example
|   |   `-- notification_model.py  # Example
|   |
|   `-- commands/             # Use-case commands, orchestrate application/ functions
|       |-- __init__.py
|       |-- generate_notification.py   # Example
|       |-- send_message.py            # Example
|       `-- get_installments.py        # Example
|
|-- tests/
|   |-- unit/                  # Unit tests
|   |-- integration/           # Integration tests
|   `-- e2e/                   # End-to-end tests
|
|-- scripts/
|   |-- migrate.py             # DB migration helper
|   `-- setup_env.py           # Local environment setup
|
|-- docs/
|   |-- architecture.md
|   |-- api_reference.md       # Example
|   `-- requirements.md
|
`-- .env                       # Environment variables (do not commit in production)
```

## Quick Rules
- `core/`: technical integrations and infrastructure concerns.
- `domain/`: business rules and use-case orchestration.
- `tests/`: keep structure close to production modules.
- `scripts/`: operational automation (setup, migration, utilities).

Obs.:
- Trocar os.environ para client('secret_manager') -> config.py
- Utilizar Secret Managers já existentes para casos possíveis (E.g.: db e api)
- Imports devem usar caminho relativo sempre
- Padronizar arquivos de inicialização main.main
- Repositórios com pipeline fazendo commit e apontando alias baseado na branch (pesquisa)
- Artefato mew + ekans