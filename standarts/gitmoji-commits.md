# Padrão de Commits — Gitmoji Guide

> Referência de emojis semânticos para mensagens de commit claras, rastreáveis e expressivas.

---

## Anatomia do Commit

O formato correto é:

```text
emoji mensagem curta e objetiva
emoji (escopo): mensagem curta e objetiva
```

Exemplos válidos:

```text
⚡️ Lazyload home screen images
🐛 Fix `onClick` event handler
🔖 Bump version `1.2.0`
♻️ (components): Transform classes to hooks
📈 Add analytics to the dashboard
🌐 Support Japanese language
♿️ (account): Improve modals a11y
```

## Regras Gerais

- O commit começa com o emoji, sem prefixo obrigatório como `feat:` ou `fix:`
- O escopo é opcional e vem entre parênteses logo após o emoji
- A mensagem deve ser curta, clara e no imperativo
- Evite ponto final no fim da linha do título
- Mantenha a linha do commit por volta de 72 caracteres quando possível
- Use corpo do commit só quando precisar explicar contexto, impacto ou breaking change

---

## Exemplos por Uso

| Emoji | `:code:` | Uso | Exemplo |
|-------|----------|-----|---------|
| ✨ | `:sparkles:` | Nova funcionalidade | `✨ Add voucher retry queue` |
| 🎉 | `:tada:` | Begin a project / initial commit | `🎉 initial project setup` |
| 💄 | `:lipstick:` | Add or update UI/styling | `💄 update button hover states` |
| 🐛 | `:bug:` | Correção de bug | `🐛 Fix SAP login fallback` |
| 🩹 | `:adhesive_bandage:` | Correção pequena | `🩹 Correct typo in status label` |
| 🚑 | `:ambulance:` | Critical hotfix | `🚑 patch SQL injection vulnerability` |
| ♻️ | `:recycle:` | Refatoração | `♻️ (sap): Simplify recovery flow` |
| ⚡️ | `:zap:` | Performance | `⚡️ Reduce SQL polling overhead` |
| 📝 | `:memo:` | Documentação | `📝 Update AGENTS guide for SAP recovery` |
| 🔧 | `:wrench:` | Configuração | `🔧 Add SSO and manual SAP connection settings` |
| 🔖 | `:bookmark:` | Versionamento | `🔖 Bump version `1.2.0`` |
| 📈 | `:chart_with_upwards_trend:` | Analytics/telemetria | `📈 Add runtime execution metrics` |
| 🌐 | `:globe_with_meridians:` | Idioma/i18n | `🌐 Support Portuguese status labels` |
| ♿️ | `:wheelchair:` | Acessibilidade | `♿️ (account): Improve modals a11y` |
| ✅ | `:white_check_mark:` | Testes | `✅ Add tests for voucher validation` |
| 👷 | `:construction_worker:` | CI/CD | `👷 Update pipeline for executable build` |
| 🧪 | `:test_tube:` | Add failing test (TDD) | `🧪 add failing test for contract renewal` |
| 🔥 | `:fire:` | Remoção | `🔥 Remove legacy SAP recorder script` |
| 🚚 | `:truck:` | Mover/renomear | `🚚 Move AGENT spec to docs/AGENTS.md` |
| ⏪ | `:rewind:` | Revert changes | `⏪ undo breaking auth changes` |
| 🗑️ | `:wastebasket:` | Deprecate code that needs cleanup | `🗑️ mark legacy API v1 as deprecated` |
| 🔒 | `:lock:` | Fix security issues | `🔒 enforce HTTPS on all routes` |
| ☁️ | `:cloud:` | Infrastructure/cloud changes | `☁️ add AWS Lambda function for alerts` |
| 🚀 | `:rocket:` | Deploy stuff | `🚀 release v1.2.0 to production` |
| 🐳 | `:whale:` | Docker-related changes | `🐳 add multi-stage build to Dockerfile` |
| 🔐 | `:closed_lock_with_key:` | Add or update secrets/auth | `🔐 rotate JWT signing keys` |
| 📦 | `:package:` | Add or update packages/dependencies | `📦 update npm dependencies` |
| 🏗️ | `:building_construction:` | Make architectural changes | `🏗️ migrate to multitenant schema` |
| 💥 | `:boom:` | Introduce breaking changes | `💥 rename API endpoint /users to /accounts` |


---

## Dicas de Uso no Terminal

```bash
# Commit simples
git commit -m "🐛 Fix SAP login fallback"

# Commit com escopo
git commit -m "♻️ (sap): Simplify recovery flow"

# Commit com corpo
git commit -m "🔧 Add SAP SSO fallback settings" -m "Prioritizes s10 for SSO and n10 for manual login fallback."
```

---

> Referência completa: [gitmoji.dev](https://gitmoji.dev)
