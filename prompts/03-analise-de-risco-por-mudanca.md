# Prompt 03 — Análise de risco baseada em mudança de código

**Objetivo:** a partir de um PR (diff + descrição), identificar o que pode quebrar, quem é afetado e quais testes rodar — inclusive o que **não** aparece no diff.
**Entrada:** `mudancas/PR-xxx/PR-xxx.md`, `PR-xxx.diff`, a US relacionada e as regras de negócio.
**Saída:** `qa/riscos/RISCO-PR-xxx.md` (estrutura validada pelo guardrail do Desafio 3).

---

## Prompt (copie e cole)

```text
Você é um(a) QA sênior fazendo a revisão de risco de um pull request antes do merge.
Seja cético(a): a descrição do PR pode estar incompleta ou errada.

<contexto>
- Descrição do PR: @mudancas/{{pasta}}/{{PR-xxx}}.md
- Diff: @mudancas/{{pasta}}/{{PR-xxx}}.diff
- História nova (se houver): @mudancas/{{pasta}}/{{US-xx}}.md
- Regras de negócio vigentes: @requisitos/regras-de-negocio.md
- Código atual do projeto: pasta src/ (leia os arquivos que o diff altera E os que os chamam)
- Testes existentes: tests/regras/regras.test.js
</contexto>

<tarefa>
Escreva o relatório com EXATAMENTE estas seções:

## 1. Resumo da mudança
O que o PR realmente faz (segundo o diff, não segundo a descrição). Aponte qualquer
diferença entre o que a descrição diz e o que o código faz.

## 2. Mapa de impacto
Funções alteradas → quem as chama → telas/fluxos afetados. Inclua arquivos que
DEVERIAM ter sido alterados e não foram.

## 3. Matriz de riscos
| ID | Risco | Evidência (arquivo:trecho do diff) | Regra afetada | Probabilidade (1-3) | Impacto (1-3) | Nível (P×I) |
Ordene do maior para o menor nível.

## 4. Testes recomendados
Para cada risco com nível ≥ 6: um teste com pré-condição, dados concretos e resultado
esperado em valores (R$, mensagens). Indique se a suíte atual já cobre (sim/não).

## 5. Lacunas na suíte automatizada
Por que os testes existentes passam apesar dos riscos?

## 6. Recomendação
APROVAR | APROVAR COM RESSALVAS | BLOQUEAR — com justificativa e lista de bloqueantes.
</tarefa>

<regras>
- Toda afirmação de risco deve citar o trecho do diff ou do requisito que a sustenta.
- Se algo for suposição, escreva "HIPÓTESE" e diga como confirmar.
- Calcule valores esperados mostrando a conta (ex.: 149,90 × 5% = 7,495 → R$ 7,50).
- Português do Brasil.
</regras>
```

## Variações úteis
- **Visão de negócio:** “Reescreva a matriz para um gerente de produto: impacto em R$ estimado por mil pedidos.”
- **Smoke de deploy:** “Liste os 5 testes que eu rodaria em produção logo após o deploy deste PR.”
- **Comparação:** “Qual dos PRs 101, 102 e 103 é mais arriscado? Justifique com os riscos de maior nível de cada um.”

## Como avaliar a resposta da IA
- [ ] Ela percebeu algo que **não está no diff** (arquivo esquecido, job ausente, requisito contrariado)?
- [ ] Questionou as afirmações da descrição (“refactor puro”, “risco baixo”, “pequenos ajustes”)?
- [ ] Os testes sugeridos têm **valores** e não só “testar o boleto”?
- [ ] Você **reproduziu** os riscos de nível 9 aplicando o diff? (a IA pode errar a conta!)

## Anti-padrões
- Mandar só o diff, sem as regras → a IA avalia “qualidade de código”, não risco de negócio.
- Confiar no “CI verde” da descrição.
- Aceitar riscos genéricos (“pode haver bugs de integração”) sem evidência.
