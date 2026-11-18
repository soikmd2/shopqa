# Desafios práticos de guardrails (hooks)

| # | Desafio | Evento | Nível | Ideia central |
|---|---------|--------|-------|---------------|
| 1 | [Contexto automático](desafio-1-contexto-automatico/ENUNCIADO.md) | `UserPromptSubmit` | 🟢 básico | Guardrail que **ajuda** (injeta contexto) em vez de só bloquear |
| 2 | [Rastreabilidade anti-alucinação](desafio-2-rastreabilidade/ENUNCIADO.md) | `PostToolUse` | 🟡 intermediário | Validar a saída da IA **contra a fonte de verdade** e devolver para correção |
| 3 | [Portão do relatório de risco](desafio-3-portao-relatorio-de-risco/ENUNCIADO.md) | `Stop` | 🔴 avançado | Impedir que a IA “termine” com trabalho incompleto — sem loop infinito |

## Fluxo de trabalho
1. Leia o `ENUNCIADO.md` e os exemplos em `guardrails/hooks/` (E1–E6).
2. Complete os `TODO` do `hook.mjs` da pasta do desafio.
3. Rode o corretor: `npm run desafios:corrigir` (mostra ✔/✖ por critério).
4. Depure um cenário isolado: `npm run hooks:testar -- <hook> '<json de entrada>'`.
5. Instale e veja funcionando no Claude Code: `npm run guardrails:instalar -- --desafios` e depois `/hooks`.

## Regras do jogo
- Pode (e deve!) usar IA para ajudar a escrever o hook — mas **você** responde pelos critérios. Leia o código gerado.
- Não altere os arquivos `corretor.test.mjs`.
- Bônus: escreva um novo critério de aceite para o seu desafio e um teste no corretor.
