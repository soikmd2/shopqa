# Prompt 04 — Transformar uma observação em bug report

**Objetivo:** partir de anotações soltas da execução de teste e chegar a um bug report claro, reproduzível e com severidade justificada.
**Entrada:** suas anotações + o caso de teste + a regra violada.
**Saída:** `qa/bugs/BUG-xxx.md` no formato de `qa/bugs/TEMPLATE.md`.

---

## Prompt (copie e cole)

```text
Você é um(a) QA que escreve bug reports que desenvolvedores conseguem reproduzir
na primeira tentativa.

<anotacoes>
{{cole aqui suas anotações: o que fez, o que viu, prints descritos, valores}}
</anotacoes>

<contexto>
- Caso de teste executado: {{TC-xxx-nnn}} em @qa/casos-de-teste/casos-de-teste.json
- Regras: @requisitos/regras-de-negocio.md
- Modelo: @qa/bugs/TEMPLATE.md
</contexto>

<tarefa>
1. Preencha o template com passos numerados, mínimos e determinísticos.
2. Em "Resultado esperado", cite literalmente a regra (RN-xx) ou o AC.
3. Classifique a severidade (critica/alta/media/baixa) e justifique em 1 frase
   olhando o impacto no negócio — não a dificuldade técnica.
4. Liste o que você ainda NÃO sabe e o que eu deveria testar para isolar a causa
   (ex.: acontece com outros cupons? com outro valor?).
</tarefa>

<regras>
- Não invente evidências que não estão nas anotações.
- Não sugira a correção no código, a menos que eu peça.
- Somente dados fictícios.
</regras>
```

## Como avaliar a resposta
- [ ] Alguém que nunca viu a loja reproduz o bug seguindo os passos?
- [ ] A severidade considera o contexto da história (ex.: a US-04 cita prejuízo com cupons)?
- [ ] Ela separou **fato** (observado) de **hipótese** (causa provável)?
