# Prompt 02 — Geração de casos de teste

**Objetivo:** gerar casos de teste rastreáveis, com dados concretos e resultado esperado verificável, usando técnicas formais (partição de equivalência, valor-limite, tabela de decisão, transição de estados).
**Entrada:** user story + regras de negócio + massa de dados + exemplos de casos existentes.
**Saída:** `qa/casos-de-teste/{{nome}}.json` (validado automaticamente pelo guardrail E3).

---

## Prompt (copie e cole)

```text
Você é um(a) engenheiro(a) de testes especialista em técnicas de projeto de teste.

<contexto>
- História: @requisitos/{{US-xx-arquivo}}.md
- Regras: @requisitos/regras-de-negocio.md
- Massa de dados fictícia (use SOMENTE estes dados): @qa/massa-de-dados.md
- Formato e exemplos: @qa/README.md e os casos {{TC-xxx-001}} e {{TC-xxx-002}} de
  @qa/casos-de-teste/casos-de-teste.json
</contexto>

<tarefa>
1. Antes de escrever casos, liste em uma tabela as TÉCNICAS aplicadas a cada regra:
   | Regra | Técnica | Partições / limites / combinações identificadas |
   Para valores-limite, liste explicitamente: limite−1 centavo, limite, limite+1 centavo.
2. Gere os casos de teste em JSON no formato do projeto, com:
   - id no padrão TC-{{AAA}}-NNN, continuando a numeração a partir de {{próximo número}};
   - "historia" e "criterio" que EXISTAM na história (não invente ACs);
   - "regras" com os IDs RN-xx cobertos;
   - "dados" concretos da massa de dados;
   - "resultadoEsperado" observável: mensagem exata entre aspas, valor em R$, estado da tela.
3. Inclua obrigatoriamente: cenários positivos, negativos, de valor-limite e ao menos
   um de segurança ou de concorrência quando a regra permitir.
4. No final, uma tabela de COBERTURA: RN-xx × TC-ids, apontando regras sem cobertura.
</tarefa>

<restricoes>
- Proibido usar frases vagas como "funciona corretamente", "conforme esperado",
  "sem erros" no resultado esperado.
- Um caso de teste verifica UM comportamento.
- Não use dados pessoais reais. Não invente produtos, cupons ou contas fora da massa.
- Salve o resultado em qa/casos-de-teste/{{nome}}.json no formato { "projeto", "versaoSchema", "casos": [...] }.
</restricoes>
```

## Variações úteis
- **A partir de um PR:** “Gere apenas casos de **regressão** para as funções alteradas no diff @mudancas/PR-101-boleto/PR-101.diff, priorizados por risco.”
- **Revisão:** “Revise os casos abaixo e aponte: duplicados, sem rastreabilidade, resultado vago, dado que não existe na massa.”
- **Automação:** “Converta TC-CUP-004 e TC-CUP-008 em testes `node:test` sobre `src/domain/cupons.js`, injetando a data `hoje`.”

## Como avaliar a resposta da IA
- [ ] Os limites incluem o valor **exato** do limite (ex.: R$ 299,00 para frete grátis)?
- [ ] As partições escolhidas separam “0 pedidos”, “1 pedido” e “N pedidos” (RN-15)?
- [ ] Os resultados esperados batem com as regras? **Recalcule** pelo menos dois valores à mão.
- [ ] Algum caso usa uma conta/cupom que não existe? (alucinação de massa)

## Anti-padrões
- “Gere 50 casos de teste” → quantidade sem técnica gera redundância.
- Usar a própria aplicação como oráculo (“o esperado é o que a tela mostra”).
- Copiar a capitalização/formatação exata do requisito em todos os dados (esconde bugs como o de busca).
