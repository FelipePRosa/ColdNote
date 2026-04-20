# Python Architecture Standard — v1.0

> **Clean · Scalable · Organic**
>
> Guia de Referência para Criação de Repositórios Python
> Versão 1.0 · 2025

---

## 1. Visão Geral

Este documento define o padrão oficial de arquitetura para todos os repositórios Python da organização. O objetivo é garantir consistência, manutenibilidade e escalabilidade em projetos de qualquer porte — desde microserviços até plataformas completas.

> **💡 Princípios Fundamentais**
> - **Clean Architecture:** Separação clara de responsabilidades entre camadas
> - **Domain-Driven Design (DDD):** Domínio de negócio isolado e explícito
> - **Dependency Inversion:** Camadas internas nunca dependem das externas
> - **Testabilidade:** Estrutura que favorece testes unitários, de integração e E2E
> - **Organicidade:** Estrutura que cresce naturalmente sem romper contratos

### 1.1 Quando Aplicar Este Padrão

Este padrão é recomendado para:

- APIs REST e GraphQL (FastAPI, Flask, Django)
- Workers e processamento assíncrono
- Funções serverless (AWS Lambda, Azure Functions)
- Pipelines de dados e ETL
- Sistemas de IA e ML com lógica de negócio

> **⚠️ Projetos simples (< 500 linhas, scripts únicos)**
> Para scripts utilitários ou protótipos rápidos, uma estrutura flat é aceitável. Adote este padrão quando o projeto tiver mais de um domínio ou equipe.

---

## 2. Estrutura de Diretórios

Abaixo está a estrutura canônica de um projeto Python seguindo este padrão:

```
src/
├── config.py                 # Configurações centralizadas (env vars, secrets)
├── main.py                   # Entry point principal (Lambda, CLI, server)
│
├── endpoint/                 # Camada de interface (HTTP, WebSocket, CLI)
│   ├── main.py               # Inicialização do servidor / app
│   ├── utils.py              # Helpers exclusivos de endpoint
│   ├── auth/                 # Middlewares e lógica de autenticação
│   └── routes/               # Rotas organizadas por feature
│       └── banner.py
│
├── core/                     # Infraestrutura e integrações técnicas
│   ├── mew/                  # Módulo de infraestrutura específico
│   │   ├── generate.py
│   │   ├── jobs.py
│   │   ├── config.py
│   │   ├── core.py
│   │   └── arbok/            # Adaptadores de banco/fila/storage
│   │       ├── postgres.py
│   │       ├── mongo.py
│   │       └── odbc.py
│   ├── services/             # Integrações com serviços externos
│   │   ├── openai_service.py
│   │   └── pagarme_service.py
│   └── utils/                # Utilitários transversais (sem lógica de negócio)
│       ├── notations.py
│       └── helpers.py
│
├── domain/                   # Coração da aplicação — lógica de negócio pura
│   ├── objects/              # Entidades, Value Objects, modelos de domínio
│   │   ├── payment_models.py
│   │   └── notification_models.py
│   ├── operations/           # Use Cases e regras de negócio
│   │   ├── balance_operations.py
│   │   ├── payment_operations.py
│   │   ├── notification_operations.py
│   │   └── installments_operations.py
│   └── commands/             # Orquestradores e handlers de comando
│       ├── generate_notification_commands.py
│       ├── send_message_commands.py
│       └── get_installments_commands.py
│
├── tests/                    # Testes automatizados
│   ├── unit/                 # Testes unitários por módulo
│   ├── integration/          # Testes com serviços externos (mocked)
│   └── e2e/                  # Testes ponta-a-ponta
│
├── scripts/                  # Automações operacionais
│   ├── migrate.py            # Migrações de banco
│   └── setup_env.py          # Setup de ambiente
│
└── docs/                     # Documentação do projeto
    ├── architecture.md
    ├── api_reference.md
    └── requirements.md

# Raiz do repositório
.env                          # Variáveis de ambiente (nunca versionar valores reais)
.gitignore
dockerfile
docker-compose.yml
azure-pipelines.yml
template.yaml                 # SAM / CloudFormation (se serverless)
README.md
pyproject.toml                # Gerenciamento de dependências (Poetry/PDM)
Makefile                      # Comandos operacionais padronizados
```

---

## 3. Camadas da Arquitetura

A arquitetura é dividida em quatro camadas concêntricas. A regra de dependência é inviolável: camadas externas dependem das internas — nunca o contrário.

| Nível | Camada | Diretório | Responsabilidade |
|-------|--------|-----------|------------------|
| 1 (Core) | Domain | `src/domain/` | Regras de negócio puras. Zero dependências externas. |
| 2 | Core / Infra | `src/core/` | Infraestrutura, DBs, filas, serviços externos. |
| 3 | Endpoint | `src/endpoint/` | Interface HTTP/CLI/WebSocket. Recebe e valida input. |
| 4 (Shell) | Config / Scripts | `config.py`, `scripts/` | Bootstrap, env vars, operações de manutenção. |

### 3.1 Domain — O Núcleo

A camada de domínio é o coração do sistema. Ela deve ser completamente independente de frameworks, bancos de dados e serviços externos. Contém três sub-módulos:

#### domain/objects/

Entidades e Value Objects. Representam os conceitos fundamentais do negócio.

```python
# domain/objects/payment_models.py
from dataclasses import dataclass
from decimal import Decimal
from enum import Enum

class PaymentStatus(Enum):
    PENDING   = 'pending'
    APPROVED  = 'approved'
    FAILED    = 'failed'

@dataclass(frozen=True)
class Payment:
    id: str
    amount: Decimal
    status: PaymentStatus
    customer_id: str

    def is_approved(self) -> bool:
        return self.status == PaymentStatus.APPROVED
```

#### domain/operations/

Use Cases. Cada arquivo representa uma fatia vertical de comportamento do sistema. Recebem objetos de domínio e retornam objetos de domínio — sem saber como os dados chegam ou saem.

```python
# domain/operations/payment_operations.py
from domain.objects.payment_models import Payment, PaymentStatus

class PaymentOperations:
    def approve(self, payment: Payment) -> Payment:
        if payment.amount <= 0:
            raise ValueError('Amount must be positive')
        return Payment(
            id=payment.id,
            amount=payment.amount,
            status=PaymentStatus.APPROVED,
            customer_id=payment.customer_id
        )
```

#### domain/commands/

Orquestradores. Compõem múltiplas operações em fluxos complexos. São o ponto de entrada para a lógica de domínio a partir de camadas superiores.

```python
# domain/commands/send_message_commands.py
from core.services.openai_service import OpenAIService
from domain.operations.notification_operations import NotificationOperations

class SendMessageCommand:
    def __init__(self, ai: OpenAIService, notif: NotificationOperations):
        self._ai = ai
        self._notif = notif

    def execute(self, user_id: str, prompt: str) -> str:
        response = self._ai.complete(prompt)
        self._notif.record(user_id, response)
        return response
```

### 3.2 Core — Infraestrutura

Implementa os detalhes técnicos: conexões com banco, clientes HTTP, filas de mensagens. Esta camada conhece o domínio, mas o domínio não a conhece.

#### core/mew/arbok/

Padrão Adapter para bancos de dados. Cada arquivo isola o dialeto de um storage diferente.

```python
# core/<module>/adapters/postgres.py
import psycopg2
from config import settings

class PostgresAdapter:
    def __init__(self):
        self.conn = psycopg2.connect(settings.DATABASE_URL)

    def query(self, sql: str, params: tuple = ()) -> list[dict]:
        with self.conn.cursor() as cur:
            cur.execute(sql, params)
            cols = [d[0] for d in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]
```

#### core/services/

Wrappers de serviços externos. Encapsulam SDKs de terceiros, tratam erros e fornecem uma interface limpa para o domínio.

```python
# core/services/openai_service.py
from openai import OpenAI
from config import settings

class OpenAIService:
    def __init__(self):
        self._client = OpenAI(api_key=settings.OPENAI_KEY)

    def complete(self, prompt: str, model: str = 'gpt-4o') -> str:
        res = self._client.chat.completions.create(
            model=model,
            messages=[{'role': 'user', 'content': prompt}]
        )
        return res.choices[0].message.content
```

### 3.3 Endpoint — Interface

Responsável por receber requisições externas, validar input e delegar para a camada de domínio. Não contém lógica de negócio.

```python
# endpoint/routes/payment.py  (FastAPI)
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from domain.commands.payment_commands import ProcessPaymentCommand

router = APIRouter(prefix='/payments', tags=['Payments'])

class PaymentRequest(BaseModel):
    amount: float
    customer_id: str

@router.post('/')
def create_payment(req: PaymentRequest, cmd: ProcessPaymentCommand = Depends()):
    try:
        result = cmd.execute(req.customer_id, req.amount)
        return {'id': result.id, 'status': result.status.value}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
```

### 3.4 Config — Configuração Centralizada

Um único ponto de verdade para todas as configurações. Usa Pydantic Settings para validação automática.

```python
# config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 5

    # External Services
    OPENAI_KEY: str
    PAGARME_API_KEY: str

    # App
    APP_ENV: str = 'development'  # development │ staging │ production
    DEBUG: bool = False
    LOG_LEVEL: str = 'INFO'

    class Config:
        env_file = '.env'
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

---

## 4. Convenções de Nomenclatura

### 4.1 Arquivos e Módulos

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivo Python | `snake_case` + sufixo semântico | `payment_operations.py` |
| Operations (Use Case) | `_operations.py` | `balance_operations.py` |
| Commands (Orquestrador) | `_commands.py` | `send_message_commands.py` |
| Models / Objects | `_models.py` | `notification_models.py` |
| Service (Externo) | `_service.py` | `openai_service.py` |
| Adapter (Banco/Infra) | `_adapter.py` ou `<db>.py` | `postgres.py` / `mongo.py` |
| Helpers / Utils | `helpers.py` ou `notations.py` | `helpers.py` |
| Config de módulo | `config.py` | `core/mew/config.py` |
| Tests | `test_<target>.py` | `test_payment_operations.py` |

### 4.2 Classes, Funções e Variáveis

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Classes | `PascalCase` | `PaymentOperations` |
| Funções / Métodos | `snake_case` + verbo | `process_payment()` |
| Variáveis | `snake_case` | `customer_id` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT = 3` |
| Variáveis privadas | `_prefixo` + `snake_case` | `_db_connection` |
| Type aliases | `PascalCase` | `UserId = str` |
| Enums | `PascalCase` + values `UPPER` | `PaymentStatus.APPROVED` |

---

## 5. Estratégia de Testes

### 5.1 Pirâmide de Testes

A distribuição recomendada de testes segue a pirâmide clássica, com ênfase em unitários:

| Tipo | Local | Cobertura alvo |
|------|-------|----------------|
| Unit | `tests/unit/` | 70% do total — rápidos e isolados |
| Integration | `tests/integration/` | 20% — testam contratos com infra (DB, APIs) |
| E2E | `tests/e2e/` | 10% — fluxos completos críticos de negócio |

### 5.2 Padrão de Teste Unitário

```python
# tests/unit/domain/test_payment_operations.py
import pytest
from decimal import Decimal
from domain.objects.payment_models import Payment, PaymentStatus
from domain.operations.payment_operations import PaymentOperations

class TestPaymentOperations:
    def setup_method(self):
        self.ops = PaymentOperations()
        self.payment = Payment(
            id='pay_123',
            amount=Decimal('100.00'),
            status=PaymentStatus.PENDING,
            customer_id='cus_456'
        )

    def test_approve_valid_payment(self):
        result = self.ops.approve(self.payment)
        assert result.status == PaymentStatus.APPROVED

    def test_approve_rejects_zero_amount(self):
        zero = Payment(id='pay_0', amount=Decimal('0'), status=PaymentStatus.PENDING, customer_id='c')
        with pytest.raises(ValueError, match='Amount must be positive'):
            self.ops.approve(zero)
```

### 5.3 Mocking de Dependências Externas

```python
# tests/integration/core/test_openai_service.py
from unittest.mock import patch, MagicMock
from core.services.openai_service import OpenAIService

def test_complete_returns_content():
    with patch('core.services.openai_service.OpenAI') as MockClient:
        mock_resp = MagicMock()
        mock_resp.choices[0].message.content = 'hello'
        MockClient.return_value.chat.completions.create.return_value = mock_resp

        svc = OpenAIService()
        result = svc.complete('say hello')
        assert result == 'hello'
```

---

## 6. Arquivos de Configuração na Raiz

### 6.1 pyproject.toml

Gerencie dependências com Poetry ou PDM. Nunca use `requirements.txt` sem lock file.

```toml
[tool.poetry]
name = "my-service"
version = "0.1.0"

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.111"
pydantic-settings = "^2.0"
psycopg2-binary = "^2.9"

[tool.poetry.group.dev.dependencies]
pytest = "^8.0"
pytest-cov = "^5.0"
ruff = "^0.4"
mypy = "^1.10"

[tool.ruff]
line-length = 100
select = ["E", "W", "F", "I", "UP"]

[tool.mypy]
strict = true
ignore_missing_imports = true
```

### 6.2 Makefile

Padronize os comandos operacionais do time:

```makefile
.PHONY: install test lint type-check run migrate

install:
	poetry install

test:
	poetry run pytest tests/ --cov=src --cov-report=term-missing

lint:
	poetry run ruff check src/ tests/

type-check:
	poetry run mypy src/

run:
	poetry run uvicorn src.endpoint.main:app --reload

migrate:
	poetry run python scripts/migrate.py
```

### 6.3 .gitignore Recomendado

```gitignore
# Python
__pycache__/
*.py[cod]
.venv/
dist/
*.egg-info/

# Environment
.env
.env.*
!.env.example

# Tools
.mypy_cache/
.ruff_cache/
.pytest_cache/
htmlcov/
.coverage

# IDEs
.vscode/
.idea/
*.DS_Store
```

---

## 7. Docker e CI/CD

### 7.1 Dockerfile Multi-stage

```dockerfile
FROM python:3.11-slim AS base
WORKDIR /app
RUN pip install poetry==1.8.0
COPY pyproject.toml poetry.lock ./

# ── Build stage ──────────────────────────────────────────────
FROM base AS builder
RUN poetry config virtualenvs.in-project true \
    && poetry install --only main --no-interaction

# ── Production stage ─────────────────────────────────────────
FROM python:3.11-slim AS production
WORKDIR /app
COPY --from=builder /app/.venv .venv
COPY src/ ./src/
COPY config.py .
ENV PATH='/app/.venv/bin:$PATH'
ENV PYTHONPATH='/app'
EXPOSE 8000
CMD ["uvicorn", "src.endpoint.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 7.2 Azure Pipelines

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include: [main, develop]

pool:
  vmImage: ubuntu-latest

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.11'

  - script: pip install poetry && poetry install
    displayName: 'Install dependencies'

  - script: poetry run ruff check src/ tests/
    displayName: 'Lint'

  - script: poetry run mypy src/
    displayName: 'Type check'

  - script: poetry run pytest tests/ --cov=src --cov-report=xml
    displayName: 'Tests'

  - task: PublishCodeCoverageResults@1
    inputs:
      codeCoverageTool: Cobertura
      summaryFileLocation: coverage.xml
```

---

## 8. Boas Práticas e Anti-patterns

### ✅ Faça sempre

- Type hints em todas as funções e métodos públicos
- Docstrings em classes e funções de domínio
- Injeção de dependência via construtor (não instanciar serviços dentro de funções)
- Dataclasses ou Pydantic para objetos de dados — nunca dicts anônimos
- Um único nível de abstração por função
- Commits semânticos: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`

### ❌ Nunca faça

- Importar ORM / DB diretamente em `domain/objects/` ou `domain/operations/`
- Colocar lógica de negócio em `endpoint/routes/`
- Usar variáveis de ambiente direto no código — use `config.py`
- Commitar arquivos `.env` com valores reais
- Classes God (responsabilidade única — máx. 200 linhas por arquivo)
- Testes que dependem de rede ou banco real (use mocks/fixtures)

### 8.2 Fluxo de Dados Correto

O fluxo de uma requisição deve sempre seguir esta ordem:

```
HTTP Request
│
▼
endpoint/routes/*.py          ← Valida input (Pydantic), extrai dados
│
▼
domain/commands/*.py          ← Orquestra o fluxo de negócio
│
▼
domain/operations/*.py        ← Aplica regras de negócio puras
│          │
│          └── domain/objects/*.py   ← Entidades imutáveis
│
▼
core/services/*.py            ← Interage com serviços externos
core/<module>/adapters/*.py   ← Persiste / lê dados
│
▼
HTTP Response                 ← Resultado serializado no endpoint
```

---

## 9. Checklist — Criação de Repositório

Use esta lista ao iniciar qualquer novo projeto Python:

| | Item |
|-|------|
| ☐ | Estrutura de diretórios criada conforme seção 2 |
| ☐ | Arquivos de ambiente configurados e dependências |
| ☐ | `config.py` com Pydantic Settings |
| ☐ | `.env.example` criado (nunca commitar `.env` real) |
| ☐ | `.gitignore` com padrões da seção 6.3 |
| ☐ | Dockerfile multi-stage (seção 7.1) |
| ☐ | `docker-compose.yml` para desenvolvimento local |
| ☐ | Pipeline CI/CD configurado (`azure-pipelines.yml`) |
| ☐ | `README.md` com: descrição, pré-requisitos, como rodar, variáveis de ambiente |
| ☐ | `docs/api_reference.md` (se API HTTP) |
| ☐ | Pasta `tests/` com subpastas `unit/`, `integration/`, `e2e/` |
| ☐ | Cobertura de testes ≥ 70% na camada `domain/` |
| ☐ | Type hints em todos os métodos públicos (`mypy strict`) |
| ☐ | Lint sem erros (`ruff check`) |

---

*Python Architecture Standard · v1.0 · Uso Interno — Confidential · Internal Use Only*
