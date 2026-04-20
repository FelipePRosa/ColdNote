# AGENTS.md

> Este arquivo é lido automaticamente por agentes de IA (Claude Code, Copilot, Cursor, etc.)
> antes de qualquer interação com o repositório. Mantenha-o atualizado como fonte de verdade
> do projeto. Última revisão: 2025

---

## 1. Identidade do Projeto

**Nome:** `contracts-paas`
**Tipo:** Plataforma SaaS multitenant de gestão de contratos
**Stack principal:** Python 3.11 · FastAPI · PostgreSQL · Redis · AWS Lambda · Docker
**Estágio:** Produção ativa — mudanças em `main` fazem deploy automático via CI/CD

### O que este sistema faz

Gerencia o ciclo de vida completo de contratos: criação, assinatura digital, renovação,
alertas de vencimento e auditoria. Cada cliente (tenant) tem isolamento completo de dados.

### O que este sistema NÃO faz

- Não processa pagamentos diretamente (delega para gateway externo)
- Não armazena documentos binários (usa S3 com referências)
- Não tem lógica de UI (é uma API pura)

---

## 2. Arquitetura — Regras Invioláveis

A arquitetura segue Clean Architecture com DDD. A **regra de dependência é absoluta**:
camadas internas nunca importam de camadas externas.

```
endpoint/  →  domain/commands/  →  domain/operations/  →  domain/objects/
                                          ↑
                                     core/services/
                                     core/adapters/
```

### Camadas e responsabilidades

| Camada | Diretório | Pode importar de | Nunca importa de |
|--------|-----------|------------------|------------------|
| Domain Objects | `src/domain/objects/` | stdlib, nada mais | core/, endpoint/, config |
| Domain Operations | `src/domain/operations/` | domain/objects/ | core/, endpoint/ |
| Domain Commands | `src/domain/commands/` | domain/*, core/ | endpoint/ |
| Core / Infra | `src/core/` | domain/, config | endpoint/ |
| Endpoint | `src/endpoint/` | domain/commands/, core/ | — |
| Config | `src/config.py` | pydantic_settings | tudo |

### Violações que o agente nunca deve cometer

```python
# ❌ NUNCA — ORM dentro de domain/
# src/domain/operations/contract_operations.py
from core.adapters.postgres import PostgresAdapter  # PROIBIDO

# ❌ NUNCA — lógica de negócio em route
# src/endpoint/routes/contracts.py
if contract.expires_in_days() < 30:  # PROIBIDO — isso é domain/operations/
    send_alert()

# ❌ NUNCA — instanciar serviço dentro de função
def process(data):
    svc = OpenAIService()  # PROIBIDO — injetar via construtor

# ✅ CORRETO — injeção via construtor
class ContractCommand:
    def __init__(self, repo: ContractRepository, notif: NotificationService):
        self._repo = repo
        self._notif = notif
```

---

## 3. Estrutura de Diretórios

```
src/
├── config.py                        # Único ponto de configuração (Pydantic Settings)
├── main.py                          # Entry point (Lambda handler ou uvicorn)
│
├── endpoint/
│   ├── main.py                      # App FastAPI, registra routers
│   ├── auth/
│   │   ├── middleware.py            # JWT validation, tenant extraction
│   │   └── dependencies.py         # FastAPI Depends() helpers
│   └── routes/
│       ├── contracts.py             # CRUD de contratos
│       ├── signatures.py            # Fluxo de assinatura
│       └── webhooks.py              # Recebimento de eventos externos
│
├── core/
│   ├── adapters/
│   │   ├── postgres.py              # Queries SQL puras (sem ORM)
│   │   ├── redis_cache.py           # Cache com key convention tenant-scoped
│   │   └── s3_storage.py            # Upload/download de documentos
│   ├── services/
│   │   ├── signature_service.py     # Integração com provedor de assinatura
│   │   ├── notification_service.py  # Email/SMS/Push
│   │   └── ai_service.py            # LLM para análise de cláusulas
│   └── utils/
│       ├── date_helpers.py
│       └── crypto.py
│
├── domain/
│   ├── objects/
│   │   ├── contract_models.py       # Contract, Clause, Party (dataclasses frozen)
│   │   ├── tenant_models.py         # Tenant, Plan, Quota
│   │   └── signature_models.py      # SignatureRequest, SignatureStatus
│   ├── operations/
│   │   ├── contract_operations.py   # Regras de negócio de contrato
│   │   ├── renewal_operations.py    # Lógica de renovação
│   │   └── alert_operations.py      # Cálculo de alertas de vencimento
│   └── commands/
│       ├── create_contract_command.py
│       ├── sign_contract_command.py
│       └── renew_contract_command.py
│
└── tests/
    ├── unit/
    │   └── domain/
    ├── integration/
    │   └── core/
    └── e2e/
```

---

## 4. Convenções de Nomenclatura

### Arquivos

| Tipo | Sufixo obrigatório | Exemplo |
|------|-------------------|---------|
| Use Case | `_operations.py` | `renewal_operations.py` |
| Orquestrador | `_command.py` | `sign_contract_command.py` |
| Entidade/VO | `_models.py` | `contract_models.py` |
| Serviço externo | `_service.py` | `signature_service.py` |
| Adaptador de infra | `_adapter.py` ou `<tech>.py` | `postgres.py` |
| Teste | `test_<alvo>.py` | `test_contract_operations.py` |

### Código

```python
# Classes → PascalCase
class ContractRenewalOperation: ...

# Funções/métodos → snake_case + verbo de ação
def calculate_expiry_date(): ...
def process_signature(): ...

# Constantes → UPPER_SNAKE_CASE
MAX_SIGNATORIES = 10
DEFAULT_ALERT_DAYS = 30

# Privados → underscore prefix
self._repository = repo
self._cache_ttl = 3600

# Type aliases → PascalCase
TenantId = str
ContractId = UUID

# Enums → PascalCase + valores UPPER
class ContractStatus(Enum):
    DRAFT     = 'draft'
    PENDING   = 'pending'
    ACTIVE    = 'active'
    EXPIRED   = 'expired'
    CANCELLED = 'cancelled'
```

---

## 5. Padrões de Código

### Type hints — obrigatório em tudo

```python
# ❌ NUNCA
def get_contract(id, tenant):
    ...

# ✅ SEMPRE
def get_contract(contract_id: ContractId, tenant_id: TenantId) -> Contract | None:
    ...
```

### Dataclasses frozen para objetos de domínio

```python
# ✅ Entidades são imutáveis
@dataclass(frozen=True)
class Contract:
    id: ContractId
    tenant_id: TenantId
    title: str
    status: ContractStatus
    expires_at: date
    parties: tuple[Party, ...]  # tuple, não list (imutável)

    def is_expiring_soon(self, threshold_days: int = 30) -> bool:
        return (self.expires_at - date.today()).days <= threshold_days
```

### Nunca dicts anônimos para dados estruturados

```python
# ❌ NUNCA
return {'id': c.id, 'status': c.status, 'tenant': t}

# ✅ SEMPRE — Pydantic para responses, dataclass para domínio
class ContractResponse(BaseModel):
    id: ContractId
    status: ContractStatus
    tenant_id: TenantId
```

### Tratamento de erro explícito

```python
# ❌ NUNCA — except genérico
try:
    result = operation.execute()
except Exception as e:
    logger.error(e)

# ✅ SEMPRE — exceções de domínio específicas
class ContractNotFoundError(DomainError):
    def __init__(self, contract_id: ContractId):
        super().__init__(f"Contract {contract_id} not found")

class ContractAlreadySignedError(DomainError): ...
class TenantQuotaExceededError(DomainError): ...
```

---

## 6. Multitenant — Regras Críticas

O isolamento de tenant é a regra mais importante do sistema. Uma falha aqui expõe dados de clientes.

### Redis — key convention obrigatória

```python
# Padrão: tenant:{tenant_id}:{resource}:{identifier}
# ✅ CORRETO
key = f"tenant:{tenant_id}:contract:{contract_id}"
key = f"tenant:{tenant_id}:quota:used"
key = f"tenant:{tenant_id}:session:{user_id}"

# ❌ NUNCA — chave sem tenant
key = f"contract:{contract_id}"          # PROIBIDO
key = f"quota:{tenant_id}"               # PROIBIDO (tenant não é prefixo)
```

### PostgreSQL — tenant_id em toda query

```python
# ✅ SEMPRE filtrar por tenant
async def get_contract(contract_id: str, tenant_id: str) -> dict | None:
    return await self.db.fetchone(
        "SELECT * FROM contracts WHERE id = $1 AND tenant_id = $2",
        contract_id, tenant_id  # tenant_id SEMPRE como segundo filtro
    )

# ❌ NUNCA buscar sem tenant
async def get_contract(contract_id: str) -> dict | None:  # PROIBIDO
    return await self.db.fetchone("SELECT * FROM contracts WHERE id = $1", contract_id)
```

### Middleware de autenticação

O `tenant_id` é extraído do JWT no middleware e injetado via `request.state.tenant_id`.
Nunca confie em `tenant_id` vindo do body da requisição — sempre use o do token.

```python
# ❌ NUNCA
@router.post("/contracts")
def create(req: CreateContractRequest):
    tenant_id = req.tenant_id  # PROIBIDO — pode ser forjado

# ✅ SEMPRE
@router.post("/contracts")
def create(req: CreateContractRequest, tenant: TenantContext = Depends(get_tenant)):
    tenant_id = tenant.id  # extraído do JWT pelo middleware
```

---

## 7. Testes

### Estrutura obrigatória para cada nova feature

```
tests/
├── unit/domain/
│   └── test_<feature>_operations.py    # Testa regras de negócio puras
├── integration/core/
│   └── test_<feature>_adapter.py       # Testa com DB/Redis em memória
└── e2e/
    └── test_<feature>_flow.py          # Testa o fluxo HTTP completo
```

### Padrão AAA (Arrange · Act · Assert)

```python
class TestContractOperations:
    def setup_method(self):
        self.ops = ContractOperations()

    def test_contract_expiring_soon_within_threshold(self):
        # Arrange
        contract = Contract(
            id=uuid4(),
            tenant_id="tenant_abc",
            title="Contrato Teste",
            status=ContractStatus.ACTIVE,
            expires_at=date.today() + timedelta(days=15),
            parties=()
        )

        # Act
        result = self.ops.is_expiring_soon(contract, threshold_days=30)

        # Assert
        assert result is True

    def test_contract_not_expiring_outside_threshold(self):
        # Arrange
        contract = Contract(
            ...,
            expires_at=date.today() + timedelta(days=60)
        )

        # Act & Assert
        assert self.ops.is_expiring_soon(contract, threshold_days=30) is False
```

### Mocking de dependências externas

```python
# ✅ SEMPRE mockar serviços externos em testes unitários e de integração
def test_sign_contract_sends_notification():
    mock_notif = MagicMock(spec=NotificationService)
    mock_repo = MagicMock(spec=ContractRepository)
    mock_repo.get.return_value = make_test_contract()

    cmd = SignContractCommand(repo=mock_repo, notif=mock_notif)
    cmd.execute(contract_id="c_123", tenant_id="t_456", signer_id="u_789")

    mock_notif.send_signature_confirmation.assert_called_once()
```

### Cobertura mínima exigida

| Camada | Cobertura mínima |
|--------|-----------------|
| `domain/operations/` | 90% |
| `domain/commands/` | 80% |
| `core/services/` | 70% |
| `endpoint/routes/` | 60% |

---

## 8. Commits

Padrão obrigatório: `type: emoji descrição curta`

| Type | Emoji | Quando usar |
|------|-------|-------------|
| `feat` | ✨ | Nova funcionalidade |
| `fix` | 🐛 | Correção de bug |
| `hotfix` | 🚑 | Correção crítica em produção |
| `refactor` | ♻️ | Refatoração sem mudança de comportamento |
| `perf` | ⚡ | Melhoria de performance |
| `test` | ✅ | Adição ou correção de testes |
| `docs` | 📝 | Documentação |
| `config` | 🔧 | Configuração, CI/CD, infra |
| `security` | 🔒 | Correção de segurança |
| `breaking` | 💥 | Breaking change (também adicionar `!` após type) |

```bash
# Exemplos válidos
feat: ✨ add contract renewal webhook
fix: 🐛 resolve tenant isolation in Redis cache
feat!: 💥 rename /contracts to /agreements

# Breaking change com corpo
git commit -m "feat!: 💥 change signature API response schema" \
           -m "BREAKING CHANGE: field 'signed_at' renamed to 'signature_timestamp'"
```

---

## 9. Segurança — Checklist Permanente

O agente deve verificar estes itens em qualquer código que toque segurança:

- [ ] `tenant_id` vem sempre do JWT, nunca do request body
- [ ] Toda query SQL filtra por `tenant_id`
- [ ] Toda chave Redis inclui `tenant:{id}:` como prefixo
- [ ] Nenhum secret hardcoded — usar `config.py` + variáveis de ambiente
- [ ] Arquivos `.env` nunca commitados (verificar `.gitignore`)
- [ ] Inputs de usuário validados com Pydantic antes de chegar ao domínio
- [ ] Logs nunca incluem dados sensíveis (CPF, token, senha)
- [ ] Exceções de domínio não expõem stack trace para o cliente

---

## 10. Performance

### Redis — TTLs padrão

```python
TTL_SESSION     = 3600        # 1 hora
TTL_CONTRACT    = 1800        # 30 minutos
TTL_QUOTA       = 300         # 5 minutos (dado mutável frequentemente)
TTL_TENANT_META = 86400       # 24 horas (dado estático)
```

### PostgreSQL — boas práticas

```python
# ✅ Sempre usar parâmetros preparados (evita SQL injection e melhora cache)
await db.fetch("SELECT * FROM contracts WHERE tenant_id = $1", tenant_id)

# ✅ Limitar resultados em listagens
await db.fetch("SELECT * FROM contracts WHERE tenant_id = $1 LIMIT $2 OFFSET $3",
               tenant_id, limit, offset)

# ❌ NUNCA buscar sem LIMIT em tabelas que crescem
await db.fetch("SELECT * FROM contracts WHERE tenant_id = $1")  # PROIBIDO
```

---

## 11. Documentação de Referência

Antes de criar código em uma área nova, leia o documento correspondente:

| Documento | Localização | Quando ler |
|-----------|-------------|------------|
| Padrão de arquitetura Python | `docs/python_architecture_standard.md` | Antes de criar qualquer módulo |
| Convenção de commits | `docs/gitmoji-commits.md` | Antes de commitar |
| Decisões de arquitetura abertas | `docs/agent.md` | Antes de tomar decisões de design |
| Referência da API | `docs/api_reference.md` | Antes de criar ou alterar endpoints |
| Schema do banco | `docs/database_schema.md` | Antes de criar queries ou migrações |

---

## 12. Workflow do Agente

Ao receber uma tarefa, siga sempre esta sequência:

```
1. LEIA  → Identifique os arquivos afetados antes de editar qualquer coisa
2. PLANEJE → Liste as mudanças necessárias em ordem de dependência
3. IMPLEMENTE → Uma camada por vez (domain primeiro, endpoint por último)
4. TESTE → Crie ou atualize testes para o que foi alterado
5. VERIFIQUE → Execute: make lint && make type-check && make test
6. DOCUMENTE → Atualize docstrings, AGENTS.md se novo padrão foi introduzido
```

### O agente NUNCA deve

- Editar arquivos em `main` diretamente — sempre criar branch
- Deletar testes existentes para fazer o CI passar
- Ignorar erros de type-check com `# type: ignore` sem comentário explicativo
- Introduzir dependências novas sem atualizar `pyproject.toml` e justificar no commit
- Alterar o schema do banco sem criar migration em `scripts/migrations/`
- Fazer deploy manual — o CI/CD cuida disso

### O agente SEMPRE deve

- Rodar `make lint && make type-check` antes de considerar a tarefa concluída
- Criar testes para toda nova `operation` ou `command`
- Manter a cobertura igual ou maior que estava antes da mudança
- Usar `make migrate` para aplicar migrações, nunca SQL direto
- Atualizar `docs/agent.md` se uma decisão de arquitetura for tomada

---

## 13. Variáveis de Ambiente

Todas as variáveis estão definidas em `src/config.py`. Nunca acesse `os.environ` diretamente.

```python
# ❌ NUNCA
import os
api_key = os.environ.get('OPENAI_KEY')

# ✅ SEMPRE
from config import settings
api_key = settings.OPENAI_KEY
```

Para desenvolvimento local, copie `.env.example` para `.env` e preencha os valores.
O arquivo `.env.example` deve ser atualizado sempre que uma nova variável for adicionada.

---

## 14. Comandos Úteis

```bash
make install        # Instala dependências (poetry install)
make run            # Sobe o servidor local com hot-reload
make test           # Roda todos os testes com cobertura
make lint           # Verifica estilo com ruff
make type-check     # Verifica tipos com mypy
make migrate        # Aplica migrações pendentes
make coverage       # Abre relatório de cobertura HTML no browser
make docker-up      # Sobe postgres + redis localmente via docker-compose
make docker-down    # Derruba os containers
```

---

*AGENTS.md · Atualizar este arquivo quando novos padrões forem estabelecidos.*
*Qualquer decisão arquitetural tomada pelo agente deve ser registrada em `docs/agent.md`.*
