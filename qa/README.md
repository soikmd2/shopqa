# Pasta de QA

| Pasta / arquivo | O que guardar |
|-----------------|---------------|
| `casos-de-teste/casos-de-teste.json` | **Fonte de verdade** dos casos de teste (validada pelo guardrail E3). |
| `casos-de-teste/casos-de-teste.md` / `.csv` | Versões legíveis — geradas por `npm run casos:exportar`. Use o CSV para registrar status/evidência na execução. |
| `bugs/` | Um arquivo por bug, a partir de `bugs/TEMPLATE.md`. |
| `riscos/` | Relatórios de análise de risco de cada PR (`RISCO-PR-101.md` …), gerados com `prompts/03-analise-de-risco-por-mudanca.md`. |
| `massa-de-dados.md` | Contas, cartões, CEPs e produtos fictícios. |

## Esquema de um caso de teste

```json
{
  "id": "TC-CUP-011",
  "titulo": "Descreve o objetivo em uma frase",
  "historia": "US-04",
  "criterio": "AC-04.5",
  "regras": ["RN-14"],
  "tipo": "funcional | negativo | limite | seguranca | usabilidade | desempenho | acessibilidade | regressao",
  "prioridade": "critica | alta | media | baixa",
  "precondicoes": ["..."],
  "dados": { "cupom": "BLACK50" },
  "passos": ["...", "..."],
  "resultadoEsperado": "Algo observável: mensagem exata, valor, estado da tela.",
  "automatizavel": true
}
```

Schema formal: `guardrails/schemas/caso-de-teste.schema.json`.
