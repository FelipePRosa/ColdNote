# Architecture Pattern

Lambda names -> snake_case

projeto_functionality

E.g.: 
generic_send_email
neoapp_genia_voice

duas branchs por lambda (hom e prod)

## Suggested Structure
```text
src/
|-- config.py                  # Project settings (keys, env vars, etc.)
|-- main.py                    # Entry point for AWS Lambda or main execution
|
|-- endpoint/ 
|   |-- main.py                # FastAPI app
|   |-- utils.py               # APIs utils
|   `-- routes/
|       `--banner
|
|-- core/
|   |-- mew/
|   |   |--generate.py
|   |   |--jobs.py
|   |   |--config.py
|   |   |--core.py
|   |   `--arbok                # Database connection (singleton/pool)
|   |       |--odbc.py
|   |       |--postgres.py
|   |       `--mongo.py
|   |
|   |-- services/              # External services
|   |   |-- openai_service.py
|   |   `-- pagarme_service.py
|   |
|   `-- utils/                 # Helper functions
|       |-- notations.py
|       `-- helpers.py
|
|-- domain/                   # Business logic       
|   |-- operations/          #business/application logic
|   |   |-- banner_operations.py
|   |   |-- payment_operations.py
|   |   |-- notification_operations.py
|   |   `-- installments_operations.py
|   |
|   |-- models/               # Domain models
|   |   |-- banner_models.py
|   |   |-- payment_models.py
|   |   |-- installment_models.py
|   |   `-- notification_models.py
|   |
|   `-- commands/             # Use-case commands
|       |-- banner_commands.py
|       |-- payment_commands.py
|       |-- installment_commands.py
|       `-- notification_commands.py
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
- Repositórios com pipeline fazendo commit e apontando alias baseado na branch
- Artefato mew + ekans