# Padrão de Commits — Gitmoji Guide

> Referência de emojis semânticos para mensagens de commit claras, rastreáveis e expressivas.

---

## Anatomia do Commit

```
type: emoji mensagem curta e objetiva

feat: ✨ add contract signature webhook
fix: 🐛 resolve tenant isolation bug in Redis cache
docs: 📝 update agent.md with Redis key conventions
```

**Regras gerais:**

- Imperativo no presente: `add feature` e não `added feature`
- Sem ponto final na mensagem curta
- Limite de ~72 caracteres na linha do título
- Emoji vem logo após o `type:` e antes da mensagem
- Breaking changes: adicionar `!` após o type → `feat!: 💥 rename API`

---

## Features

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| ✨ | `:sparkles:` | `feat` | Introduce new features | `feat: ✨ add user authentication module` |
| 🎉 | `:tada:` | `init` | Begin a project / initial commit | `init: 🎉 initial project setup` |
| 💄 | `:lipstick:` | `style` | Add or update UI/styling | `style: 💄 update button hover states` |
| ♿ | `:wheelchair:` | `a11y` | Improve accessibility | `a11y: ♿ add ARIA labels to nav` |
| 🌐 | `:globe_with_meridians:` | `i18n` | Internationalization/localization | `i18n: 🌐 add Portuguese translations` |

---

## Bug Fixes

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| 🐛 | `:bug:` | `fix` | Fix a bug | `fix: 🐛 resolve null pointer on logout` |
| 🚑 | `:ambulance:` | `hotfix` | Critical hotfix | `hotfix: 🚑 patch SQL injection vulnerability` |
| 🩹 | `:adhesive_bandage:` | `fix` | Simple fix for non-critical issue | `fix: 🩹 correct typo in error message` |

---

## Refactor & Performance

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| ♻️ | `:recycle:` | `refactor` | Refactor code | `refactor: ♻️ extract payment service class` |
| ⚡ | `:zap:` | `perf` | Improve performance | `perf: ⚡ cache Redis tenant keys` |
| 🏗️ | `:building_construction:` | `arch` | Make architectural changes | `arch: 🏗️ migrate to multitenant schema` |
| 💥 | `:boom:` | `breaking` | Introduce breaking changes | `breaking: 💥 rename API endpoint /users to /accounts` |

---

## Tests & QA

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| ✅ | `:white_check_mark:` | `test` | Add or update tests | `test: ✅ add unit tests for auth middleware` |
| 🧪 | `:test_tube:` | `test` | Add failing test (TDD) | `test: 🧪 add failing test for contract renewal` |
| 👷 | `:construction_worker:` | `ci` | Add or update CI/CD pipeline | `ci: 👷 add GitHub Actions deploy workflow` |

---

## Docs & Config

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| 📝 | `:memo:` | `docs` | Add or update documentation | `docs: 📝 update agent.md architecture spec` |
| 🔧 | `:wrench:` | `config` | Add or update config files | `config: 🔧 update Redis TTL settings` |
| 🔐 | `:closed_lock_with_key:` | `security` | Add or update secrets/auth | `security: 🔐 rotate JWT signing keys` |
| 📦 | `:package:` | `build` | Add or update packages/dependencies | `build: 📦 update npm dependencies` |

---

## DevOps & Infra

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| 🚀 | `:rocket:` | `deploy` | Deploy stuff | `deploy: 🚀 release v1.2.0 to production` |
| 🐳 | `:whale:` | `docker` | Docker-related changes | `docker: 🐳 add multi-stage build to Dockerfile` |
| ☁️ | `:cloud:` | `infra` | Infrastructure/cloud changes | `infra: ☁️ add AWS Lambda function for alerts` |
| 🔒 | `:lock:` | `security` | Fix security issues | `security: 🔒 enforce HTTPS on all routes` |

---

## Cleanup

| Emoji | `:code:` | `type` | Descrição | Exemplo |
|-------|----------|--------|-----------|---------|
| 🔥 | `:fire:` | `remove` | Remove code or files | `remove: 🔥 delete deprecated payment module` |
| 🗑️ | `:wastebasket:` | `deprecate` | Deprecate code that needs cleanup | `deprecate: 🗑️ mark legacy API v1 as deprecated` |
| 🚚 | `:truck:` | `move` | Move or rename resources | `move: 🚚 rename services/ to modules/` |
| ⏪ | `:rewind:` | `revert` | Revert changes | `revert: ⏪ undo breaking auth changes` |

---

## Dicas de Uso no Terminal

```bash
# Commit simples
git commit -m "feat: ✨ add contract renewal alerts"

# Commit com breaking change
git commit -m "feat!: 💥 rename /contracts to /agreements" -m "BREAKING CHANGE: update all client integrations"

# Commit com corpo detalhado
git commit -m "perf: ⚡ cache Redis tenant keys" -m "Adds scoped key convention: tenant:{id}:resource. TTL set to 3600s."

# Ver log com emojis
git log --oneline --graph
```

---

> Referência completa: [gitmoji.dev](https://gitmoji.dev)
