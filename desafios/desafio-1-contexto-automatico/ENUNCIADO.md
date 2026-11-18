# Desafio 1 — Contexto automático 🟢

**Evento:** `UserPromptSubmit` · **Arquivo:** `hook.mjs` · **Tempo sugerido:** 20 min

## Problema
Toda vez que alguém pede “gere casos de teste para a US-04”, a IA responde sem ler a história nem as regras — e inventa. Pedir “leia o arquivo X antes” em todo prompt é chato e as pessoas esquecem.

## Sua missão
Escrever um hook que, **antes do prompt chegar ao modelo**:

1. Detecta histórias citadas no prompt (`US-04`, `us-04`, várias no mesmo texto, sem repetição).
2. Para cada história **existente**, injeta como contexto (stdout, exit 0):
   `- US-04 — Cupons de desconto · regras: RN-11, RN-12, ... · arquivo: requisitos/US-04-cupons.md`
3. Se alguma história **não existir**, bloqueia o prompt (exit 2) e lista as histórias disponíveis.
4. Prompt sem história → passa sem imprimir nada.
5. **Fail-open:** se a entrada for inválida, o hook nunca pode descartar o prompt (exit ≠ 2).

## Critérios de aceite (o corretor verifica)
| # | Cenário | Esperado |
|---|---------|----------|
| 1.1 | “Gere casos de teste para a US-04” | exit 0; stdout contém `US-04`, `Cupons de desconto`, `RN-15`, `requisitos/US-04-cupons.md` |
| 1.2 | “Compare a US-03 com a US-07” | contexto das duas |
| 1.3 | “analise a us-05” | reconhece minúsculas |
| 1.4 | “Gere casos para a US-99” | exit 2; stderr cita `US-99` e as disponíveis (`US-01` … `US-08`) |
| 1.5 | prompt sem história | exit 0 e stdout vazio |
| 1.6 | stdin que não é JSON | exit ≠ 2 |

## Como testar
```bash
npm run desafios:corrigir                     # corretor automático (todos os desafios)
npm run hooks:testar -- desafios/desafio-1-contexto-automatico/hook.mjs '{"hook_event_name":"UserPromptSubmit","prompt":"casos para a US-04"}'
```
Depois, instale de verdade (`npm run guardrails:instalar -- --desafios`), abra o Claude Code e envie “quais regras a US-04 cobre?”.

## Para pensar
- Por que **injetar contexto** é melhor do que bloquear neste caso?
- Que outros “lembretes” valeria injetar automaticamente no seu projeto real?
