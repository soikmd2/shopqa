# Desafio 2 — Rastreabilidade anti-alucinação 🟡

**Evento:** `PostToolUse` (matcher `Write|Edit`) · **Arquivo:** `hook.mjs` · **Tempo sugerido:** 30 min

## Problema
O guardrail E3 garante o **formato** dos casos de teste (`RN-\d{2}` é um ID bem formado). Mas a IA às vezes cita `RN-31` ou `AC-04.9` — IDs com formato perfeito que **não existem**. O caso parece rastreável e não é. Isso é alucinação de referência, e passa despercebido numa revisão rápida.

## Sua missão
Depois que o Claude escrever um arquivo `qa/casos-de-teste/*.json`, verificar **contra os requisitos reais** que:

1. a `historia` existe (`requisitos/US-xx-*.md`);
2. o `criterio` aparece no arquivo dessa história;
3. cada item de `regras` existe na tabela de `requisitos/regras-de-negocio.md`.

Se algo falhar → exit 2 listando **todos** os problemas (id do caso + referência inválida). O Claude recebe a lista e corrige o arquivo sozinho.

## Critérios de aceite (o corretor verifica)
| # | Cenário | Esperado |
|---|---------|----------|
| 2.1 | caso com US-04 / AC-04.5 / RN-14 | exit 0 |
| 2.2 | os 50 casos oficiais | exit 0 |
| 2.3 | regra `RN-99` | exit 2; stderr cita `TC-CUP-101` e `RN-99` |
| 2.4 | critério `AC-04.9` | exit 2; cita `AC-04.9` |
| 2.5 | história `US-42` | exit 2; cita `US-42` |
| 2.6 | dois casos com problemas | os dois ids aparecem (não pare no primeiro erro) |
| 2.7 | arquivo fora de `qa/casos-de-teste/` | exit 0 |
| 2.8 | JSON quebrado | exit 2; mensagem menciona “JSON” |

> O corretor roda o hook numa cópia temporária do projeto (variável `CLAUDE_PROJECT_DIR`). Sempre use `raizDoProjeto(entrada)` para montar caminhos.

## Para pensar
- Por que este hook é `PostToolUse` e não `PreToolUse`? O que mudaria?
- Este hook e o E3 rodam no mesmo evento. Em que ordem? Isso importa?
- Que outra “alucinação verificável” existe no seu trabalho (endpoints, campos de API, nomes de tela)?
