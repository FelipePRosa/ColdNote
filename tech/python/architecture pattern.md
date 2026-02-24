# Architecture Pattern

Lambda names -> snake_case

projeto_functionality

E.g.: 
generic_send_email
neoapp_genia_voice

repositório por projeto
- lambda_neoapp

duas branchs por lambda project_function (hom e prod)
- expire_banner_hom
- expire_banner_prod
- push_notification_hom
- push_notification_prod

lambdas
- neoapp_expire_banner {alias: hom | prod}
- neoapp_push_notification {alias: hom | prod}

## Suggested Structure
```text
src/
|-- config.py                  # Project settings (keys, env vars, etc.)
|-- main.py                    # Entry point for AWS Lambda or main execution
|
|-- endpoint/ 
|   |-- main.py                # FastAPI app
|   |-- auth/                
|   |-- utils.py               # APIs utils
|   `-- routes/
|       `--banner.py
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
|   |   |-- be_thread_operations.py
            # region logic
            - for loop
            - QUERY list by id
            - valida se começa com J
            - transformação
            - QUERY list all
            - insert
|   |   `-- installments_operations.py

|   |
|   |-- objects/               # Domain models
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
`-- docs/
    |-- architecture.md
    |-- api_reference.md       # Example
    `-- requirements.md

README.md
requirements.txt
docker-compose.yml
dockerfile
.gitignore
.env                       # Environment variables (do not commit in production)
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









----- sessao java

@RestClass("/banner")
BannerRest
{

    @Endpoint("/create")
    public void create() {}

    @Endpoint("/edit")
    public void edit() {}

}

if (path.equals("/banner/create"))
    banner_create_command():



auth
    - MobileBearerFilter
        . skipFilter
            RequestHeader -> WEB
            Request Header -> Authorization
        . doFilter
            API Straumann -> bearer
            build object UserSession (sapNumber)

    - WebSamlFilter
        . skipFilter
            RequestHeader -> IOS, ANDROID
            Cookies
        . doFilter
            API Straumann -> bearer
            build object UserSession (sapNumber)

    - RelationshipFilter
        . skipFilter
            RequestHeader Authorization -> Bearer
        . doFilter
            valida Basic
            build object UserSession (sapNumber)
