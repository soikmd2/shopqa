# Biblioteca de prompts para QA

| # | Prompt | Quando usar | Saída |
|---|--------|-------------|-------|
| 01 | [Análise de requisitos](01-analisar-requisitos.md) | Refinamento, antes do código | `qa/analise-requisitos/ANALISE-US-xx.md` |
| 02 | [Geração de casos de teste](02-gerar-casos-de-teste.md) | Após o refinamento / ao receber uma US | `qa/casos-de-teste/*.json` |
| 03 | [Análise de risco por mudança](03-analise-de-risco-por-mudanca.md) | Ao receber um PR | `qa/riscos/RISCO-PR-xxx.md` |
| 04 | [Bug report](04-reportar-bug.md) | Durante a execução | `qa/bugs/BUG-xxx.md` |

## Anatomia de um bom prompt de QA

```
PAPEL        → quem a IA é ("QA sênior cético")
CONTEXTO     → arquivos reais anexados com @ (requisitos, regras, massa, exemplos)
TAREFA       → passos numerados e formato de saída exato
REGRAS       → o que é proibido (inventar regra, frase vaga, dado real)
VERIFICAÇÃO  → checklist que VOCÊ aplica na resposta
```

## Placeholders
Tudo entre `{{ }}` deve ser substituído antes de enviar. Ex.: `{{US-xx}}` → `US-04`.

## Prompts × guardrails
Prompts **pedem** um comportamento; guardrails (hooks) **garantem** esse comportamento.
Ex.: o prompt 02 pede “sem frases vagas”; o hook E3 **recusa** o arquivo se houver frase vaga — mesmo que o prompt tenha sido esquecido. Veja `guardrails/README.md`.
