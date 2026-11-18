# Desafio 3 — Portão de qualidade do relatório de risco 🔴

**Evento:** `Stop` · **Arquivo:** `hook.mjs` · **Tempo sugerido:** 40 min

## Problema
Ao pedir uma análise de risco de PR, a IA frequentemente “termina” com um relatório incompleto: sem matriz, com riscos sem nível, ou recomendando **APROVAR** um PR que ela mesma classificou com risco alto. Você quer que o Claude **não consiga encerrar** enquanto o relatório não atingir o padrão mínimo — sem prendê-lo num loop infinito.

## Sua missão
Quando o Claude tentar encerrar (`Stop`), avaliar cada `qa/riscos/RISCO-PR-<número>.md`:

1. As 6 seções existem: `## 1. Resumo…`, `## 2. Mapa de impacto`, `## 3. Matriz de riscos`, `## 4. Testes recomendados`, `## 5. Lacunas…`, `## 6. Recomendação`.
2. A matriz tem **pelo menos 3** linhas de risco (`| R1 | … |`).
3. Cada risco termina com **nível numérico de 1 a 9** (última coluna).
4. A recomendação contém `APROVAR`, `APROVAR COM RESSALVAS` ou `BLOQUEAR`.
5. **Coerência:** `APROVAR` com algum risco de nível ≥ 6 é inválido.

Problemas → exit 2 com a lista `arquivo: problema`.
**Anti-loop:** se `stop_hook_active` for `true`, **não bloqueie de novo** — libere (exit 0) com `responderJson({ systemMessage })` avisando a pessoa que o relatório ainda está inválido.

## Critérios de aceite (o corretor verifica)
| # | Cenário | Esperado |
|---|---------|----------|
| 3.1 | nenhum relatório | exit 0 |
| 3.2 | `exemplo-valido.md` | exit 0 |
| 3.3 | sem a seção 5 | exit 2; cita o arquivo e a seção |
| 3.4 | só 2 riscos | exit 2; menciona a matriz |
| 3.5 | nível “alto” em vez de número | exit 2; menciona nível |
| 3.6 | sem recomendação | exit 2; menciona recomendação |
| 3.7 | APROVAR com risco 9 | exit 2; menciona APROVAR |
| 3.8 | `rascunho.md`, `MODELO-RISCO.md` | ignorados (exit 0) |
| 3.9 | relatório inválido + `stop_hook_active: true` | exit 0 + JSON com `systemMessage` |

## Teste de ponta a ponta (opcional, recomendado)
1. `npm run guardrails:instalar -- --desafios`
2. No Claude Code: *“Use o prompt 03 para analisar o PR-102 e salve em qa/riscos/RISCO-PR-102.md. Seja breve.”*
3. Observe o hook devolvendo o relatório para correção até ele passar.

## Para pensar
- Este portão valida **estrutura e coerência**, não **verdade**. O que continua sendo trabalho do QA humano?
- Qual a diferença entre este hook e o E6? Quando cada estratégia anti-loop (contador × `stop_hook_active`) é melhor?
