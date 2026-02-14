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
|-- lambda_handler.py          # Entry point for AWS Lambda or main execution
|
|-- core/
|   |-- database/
|   |   |-- __init__.py
|   |   |-- connection.py      # Database connection (singleton/pool)
|   |   `-- migrations/        # Migration scripts
|   |
|   |-- services/
|   |   |-- __init__.py
|   |   |-- openai_service.py
|   |   `-- pagarme_service.py
|   |
|   `-- utils/
|       |-- __init__.py
|       |-- notations.py
|       `-- helpers.py
|
|-- domain/
|   |-- dao/
|   |   |-- __init__.py
|   |   |-- balance_operation_dao.py
|   |   |-- payment_dao.py
|   |   |-- notification_dao.py
|   |   `-- installments_dao.py
|   |
|   |-- models/
|   |   |-- __init__.py
|   |   |-- payment_model.py
|   |   `-- notification_model.py
|   |
|   `-- commands/
|       |-- __init__.py
|       |-- generate_notification.py
|       |-- send_message.py
|       `-- get_installments.py
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
|   |-- api_reference.md
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