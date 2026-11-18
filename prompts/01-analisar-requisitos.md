# Prompt 01 — Análise de requisitos (shift-left)

**Objetivo:** encontrar lacunas, ambiguidades, contradições e requisitos não testáveis **antes** de existir código.
**Entrada:** uma user story (`requisitos/US-xx-*.md`) + `requisitos/regras-de-negocio.md` + `requisitos/requisitos-nao-funcionais.md`.
**Saída:** `qa/analise-requisitos/ANALISE-US-xx.md`.

---

## Prompt (copie e cole)

```text
Você é um(a) analista de qualidade sênior participando do refinamento de uma sprint
de um e-commerce brasileiro (ShopQA). Seu papel é encontrar problemas no REQUISITO,
não no código. Não invente regras: quando algo não estiver escrito, trate como lacuna.

<contexto>
Leia: @requisitos/{{US-xx-arquivo}}.md, @requisitos/regras-de-negocio.md,
@requisitos/requisitos-nao-funcionais.md e @requisitos/glossario.md
</contexto>

<tarefa>
Analise a user story {{US-xx}} e produza:

1. RESUMO — em 3 linhas, o que a história entrega e para quem.
2. ACHADOS — uma tabela com as colunas:
   | ID | Tipo | Trecho (citação literal) | Problema | Pergunta para o PO | Impacto se não resolvido |
   Tipos permitidos: AMBIGUIDADE, LACUNA, CONTRADIÇÃO, NÃO TESTÁVEL, REGRA IMPLÍCITA, RISCO.
   - CONTRADIÇÃO: cite os DOIS trechos conflitantes e seus IDs (ex.: US-03 × RN-24).
   - NÃO TESTÁVEL: proponha uma reescrita mensurável.
3. CRITÉRIOS DE ACEITE FALTANTES — cenários Gherkin (Dado/Quando/Então) que deveriam
   existir, cobrindo: valores-limite, erros, permissões, concorrência e dados inválidos.
4. RASTREABILIDADE — tabela AC × RN mostrando quais regras não têm AC que as verifique.
5. TOP 3 PERGUNTAS — as perguntas mais importantes para levar ao PO hoje.
</tarefa>

<regras>
- Cite o texto exato do requisito em cada achado (entre aspas).
- Se não tiver certeza, marque o achado como "HIPÓTESE".
- Não proponha implementação técnica; foque no comportamento esperado.
- Responda em português do Brasil.
</regras>
```

## Variações úteis
- **Só os NFRs:** “Avalie cada RNF quanto aos critérios SMART e reescreva os que não forem verificáveis.”
- **Comparar duas fontes:** “Liste todas as divergências entre a US-07 e as RN-20 a RN-26.”
- **Modo PO:** “Agora responda como o PO: quais perguntas você consegue responder só com o que está escrito?” (mostra o que é realmente lacuna).

## Como avaliar a resposta da IA (checklist do QA)
- [ ] Cada achado cita um trecho **que existe** no documento? (alucinação de requisito é comum)
- [ ] Encontrou pelo menos uma contradição **entre documentos** (US × RN)?
- [ ] Os cenários Gherkin têm **dados concretos** (valores, mensagens) e não “deve funcionar”?
- [ ] Distinguiu o que é lacuna do que é suposição dela?

## Anti-padrões
- Pedir “analise os requisitos” sem anexar as regras transversais → a IA só olha a US.
- Aceitar a lista sem conferir as citações.
- Deixar a IA “resolver” a ambiguidade escolhendo um lado — isso é decisão do PO.
