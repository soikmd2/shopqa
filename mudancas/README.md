# Mudanças de código (PRs simulados)

Três pull requests reais, como os que chegam ao QA toda sprint. Cada pasta tem:

| Arquivo | Conteúdo |
|---------|----------|
| `PR-xxx.md` | Descrição escrita pela pessoa desenvolvedora (com o “jeitão” de PR real) |
| `PR-xxx.diff` | O diff completo — aplicável com `git apply` |
| `US-xx-*.md` | A história nova que o PR implementa (quando houver) |

| PR | Tipo | Resumo |
|----|------|--------|
| [PR-101](PR-101-boleto/PR-101.md) | Feature | Pagamento por boleto bancário (US-09) |
| [PR-102](PR-102-frete-expresso-e-retirada/PR-102.md) | Feature | Entrega expressa e retirada na loja (US-10) |
| [PR-103](PR-103-refatoracao-carrinho-persistente/PR-103.md) | Refactor | Carrinho persistente + simplificação do arredondamento |

## Atividade
1. Leia a descrição do PR e a história relacionada.
2. Use `prompts/03-analise-de-risco-por-mudanca.md` com o diff, a descrição e os requisitos.
3. **Valide** o que a IA disse: aplique o diff, rode a loja e tente reproduzir cada risco alto.
4. Salve o relatório em `qa/riscos/RISCO-PR-xxx.md` (o guardrail do Desafio 3 vai conferir a estrutura).

## Aplicar e desfazer um PR
```bash
git init && git add -A && git commit -m "v1.4"   # só na primeira vez, se a pasta ainda não for um repositório
git apply mudancas/PR-101-boleto/PR-101.diff      # aplica
npm run dev                                       # explore a mudança
git checkout -- src                               # desfaz (volta para a v1.4)
```

> 💡 Os três PRs passam na suíte `npm run test:regras`. Isso diz algo sobre o risco… ou sobre a suíte?
