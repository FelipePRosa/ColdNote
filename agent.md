# ColdNote / Sprint Hub Agent Onboarding

## Objetivo do projeto

ColdNote e um repositorio de notas pessoais e de trabalho. A parte principal para agentes e o **Sprint Hub**, uma aplicacao web simples para controle de sprints em nivel executivo/leadership.

O Sprint Hub existe para acompanhar demandas e projetos em alto nivel:

- consolidar o que importa na semana
- dar visibilidade de progresso entre projetos
- destacar bloqueios, riscos e dependencias
- apoiar conversas de lideranca tecnica
- manter o historico em Markdown dentro do proprio repositorio

Ele **nao** deve virar um substituto de Azure DevOps, Jira, burndown, story points ou gestao detalhada de squad. A granularidade esperada e: "outro lider tecnico entende o status do projeto em poucos segundos".

## Mental model

Use o app como um painel semanal de acompanhamento.

- Sprint: recorte semanal ou periodo curto de acompanhamento.
- Project card/topic: unidade principal de acompanhamento high-level.
- Task/item: acao, entrega, risco ou follow-up relevante para lideranca.
- Backlog: estacionamento leve para itens que ainda nao entraram em uma sprint.
- Timeline: eventos importantes do projeto, como milestones, decisoes ou incidentes.
- Projects files: notas Markdown do projeto, editaveis pelo app.

Evite transformar cards em listas completas de tasks operacionais. Se o detalhe pertence ao time de execucao, ele provavelmente deve ficar em uma ferramenta de delivery, nao aqui.

## Estrutura relevante do repositorio

- `README.md`: resumo geral e comandos basicos.
- `sprint-hub/README.md`: resumo funcional do Sprint Hub.
- `sprint-hub/index.html`: markup principal, modais e estrutura da UI.
- `sprint-hub/styles.css`: layout, design system e responsividade.
- `sprint-hub/app.js`: estado frontend, renderizacao, filtros, parsing, autosave e chamadas API.
- `sprint-hub/server.py`: servidor local, API JSON e leitura/escrita de arquivos.
- `tech/sprints/*.md`: fonte principal de verdade das sprints.
- `tech/backlog.json`: persistencia do backlog.
- `tech/team/*.md`: arquivos de membros do time e notas individuais.
- `tech/pjs.md`: controle mensal de PJs/fornecedores.
- `tech/metricas.md` ou arquivo equivalente de metricas: referencia de metricas do time.
- `projects/<project>/`: notas por projeto.
- `projects/<project>/sprints.md`: arquivo gerado a partir das sprints.
- `projects/<project>/timeline.md`: timeline executiva do projeto.

## Como rodar

Modo principal, com leitura e escrita em arquivos:

```powershell
python sprint-hub/server.py
```

Abrir:

```text
http://127.0.0.1:8765
```

Se `sprint-hub/index.html` for aberto diretamente no navegador, o app usa `localStorage`. Esse modo serve apenas para exploracao visual. Para trabalho real, use o servidor.

## Arquitetura

O projeto e propositalmente simples.

- Frontend: HTML, CSS e JavaScript puros.
- Backend: Python stdlib com `http.server`.
- Persistencia: arquivos Markdown e JSON no repositorio.
- Sem banco de dados.
- Sem auth.
- Sem build step.

Essa simplicidade e uma escolha de produto: baixo setup, facil inspecao manual, e dados legiveis em Git. O custo e que `app.js` e monolitico e a UI e fortemente acoplada a IDs do DOM.

## Principais fluxos de dados

### Sprints

O app carrega `tech/sprints/*.md`, converte para estado em memoria, renderiza o board e salva de volta em Markdown.

Formato esperado:

```md
# Sprint 26-19

Goal: Objetivo da sprint

## Nome do Projeto [project:pasta-do-projeto]
Status: Desenvolvimento

Resumo curto do projeto.

- [ ] Item relevante (Fel + Gui) [HIGH]
- [ ] Item bloqueado [BLOCKED: aguardando dependencia]
- [x] Item concluido
```

### Projetos

Cards de projeto podem apontar para uma pasta em `projects/<project>`. Ao salvar sprints, o backend tambem regenera `projects/<project>/sprints.md` como visao agregada.

Trate `projects/*/sprints.md` como artefato gerado. Evite edicao manual nele, porque pode ser sobrescrito.

### Backlog

O backlog fica em `tech/backlog.json`. Ele e usado para itens ainda nao prontos para uma sprint.

### Timeline

Cada projeto pode ter `projects/<project>/timeline.md`.

Formato esperado:

```md
# Timeline - Nome do Projeto

## 2026-05-12 - Evento importante
Descricao curta.
```

Use timeline para fatos que devem sobreviver a semana: decisoes, milestones, riscos materializados, mudancas de escopo e dependencias relevantes.

## Data model conceitual

### Sprint

- `name`
- `goal`
- `fileName`
- `topics[]`

### Topic / project card

- `title`
- `projectKey`
- `status`
- `description`
- `items[]`

### Task / item

- `text`
- `done`
- `responsibles[]`
- `priority`: `normal` ou `high`
- `blocked`
- `blockedReason`

Tasks devem ser curtas, acionaveis e legiveis para lideranca. Nao replique todos os work items de delivery.

### Backlog item

- `text`
- `projectKey`
- `projectTitle`

Backlog e intake leve, nao uma segunda sprint.

## Endpoints principais

Leitura:

- `GET /api/sprint-files`
- `GET /api/pjs`
- `GET /api/team-members`
- `GET /api/team-metrics`
- `GET /api/team-member/file?path=...`
- `GET /api/projects/tree`
- `GET /api/projects/file?path=...`

Escrita:

- `POST /api/sprint-files/save-all`
- `POST /api/pjs/save`
- `POST /api/projects/file/save`
- `POST /api/projects/folder/create`
- `POST /api/projects/file/create`
- `POST /api/projects/file/delete`
- `POST /api/team-members/save`
- `POST /api/team-member/file/save`
- `POST /api/team-member/file/create`
- `POST /api/team-member/file/delete`

Antes de mudar endpoints ou payloads, confira os consumidores em `sprint-hub/app.js`.

## Guia para agentes

### Antes de alterar

1. Leia `README.md`, este arquivo e `sprint-hub/README.md`.
2. Rode `git status --short`.
3. Verifique se ha mudancas locais nao relacionadas. Nao reverta nada que voce nao criou.
4. Inspecione os arquivos afetados antes de editar.
5. Identifique se a mudanca afeta UI, parsing Markdown, autosave ou arquivos gerados.

### Ao alterar UI

- Preserve IDs usados em `const el = { ... }` em `sprint-hub/app.js`.
- Se adicionar um elemento com ID, registre no objeto `el` quando necessario.
- Confira event listeners no fim de `app.js`.
- Verifique desktop e mobile quando mudar layout.
- Evite textos longos em botoes e controles compactos.
- Mantenha a UI densa, utilitaria e voltada a acompanhamento recorrente.

### Ao alterar dados ou parsing

- Preserve round-trip Markdown: ler e salvar nao deve destruir informacao.
- Cuidado com `projects/*/sprints.md`, que pode ser gerado.
- Cuidado com line endings. O backend tende a escrever com `\n`.
- Nao introduza schema complexo sem necessidade real.
- Se adicionar campo novo em task/topic, atualize normalizacao, parsing, serializacao e renderizacao.

### Ao alterar backend

- `server.py` usa apenas stdlib; mantenha isso a menos que haja motivo forte.
- Valide paths para impedir escrita fora das pastas esperadas.
- Prefira respostas JSON simples e previsiveis.
- Lembre que o servidor local pode receber conexoes abortadas pelo browser durante refresh.

### Ao alterar comportamento de sprint

Pergunte sempre: isso ajuda lideranca a entender a semana ou esta puxando o app para gestao detalhada de squad?

Boas mudancas:

- filtros e buscas que ajudam revisao semanal
- melhores sinais de bloqueio e prioridade
- resumos por projeto/status/responsavel
- timeline e historico executivo
- reducao de friccao para atualizar notas

Mudancas suspeitas:

- story points
- burndown
- workflows complexos
- status demais
- campos detalhados de task operacional
- duplicacao de Azure DevOps/Jira

## Validacao recomendada

Sem suite automatizada completa, use checks pequenos:

```powershell
node --check sprint-hub/app.js
```

Para Python, se `py_compile` falhar por bloqueio de `__pycache__` no Windows/OneDrive, use:

```powershell
Get-Content -Raw sprint-hub\server.py | python -c "import sys; compile(sys.stdin.read(), 'sprint-hub/server.py', 'exec')"
```

Fluxos manuais importantes:

- abrir app em `http://127.0.0.1:8765`
- carregar sprints
- selecionar sprint
- alternar Projects View / Sprints View
- criar/editar task
- marcar task como concluida
- filtrar por responsavel/status/high/blocked/busca
- mover task entre projeto e backlog
- salvar e conferir Markdown em `tech/sprints`
- abrir Projects Files e editar um arquivo
- abrir Team e carregar membros

## Riscos conhecidos

- `app.js` concentra muitas responsabilidades.
- DOM e JS sao fortemente acoplados.
- Nao ha testes automatizados cobrindo parsing/renderizacao.
- Arquivos gerados em `projects/*/sprints.md` podem gerar diffs grandes.
- Modo `localStorage` pode confundir debugging se o servidor nao estiver rodando.
- OneDrive/Windows pode bloquear escrita temporaria em `__pycache__`.
- Edicoes manuais em Markdown fora do formato esperado podem ser parcialmente perdidas no round-trip.

## Principios de produto

- High-level primeiro.
- Markdown legivel sempre.
- Menos campos, mais clareza.
- O board deve apoiar uma conversa semanal, nao substituir ferramentas de execucao.
- Uma task boa explica uma acao, risco ou follow-up relevante.
- Um projeto bom mostra situacao, proximo passo e impedimentos sem exigir contexto profundo.

## Checklist de onboarding para agente novo

1. Ler este arquivo.
2. Ler `README.md`.
3. Ler `sprint-hub/README.md`.
4. Abrir `sprint-hub/index.html`, `sprint-hub/app.js`, `sprint-hub/server.py`.
5. Inspecionar um arquivo em `tech/sprints/`.
6. Inspecionar `tech/backlog.json`.
7. Inspecionar uma pasta em `projects/`.
8. Rodar o servidor.
9. Exercitar os fluxos principais no navegador.
10. Fazer mudancas pequenas e validar parsing/renderizacao antes de ampliar escopo.

## Regra final

Quando estiver em duvida, preserve a simplicidade. Este projeto e um controle de sprint high-level para lideranca tecnica. A melhor contribuicao de um agente e deixar a informacao mais clara, mais facil de revisar e menos custosa de manter.
