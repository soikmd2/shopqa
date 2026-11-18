---
id: US-03
titulo: Carrinho de compras
epico: EP-02 Compra
prioridade: Must have
estimativa: 5 pontos
status: Done (Sprint 12)
regras: [RN-08, RN-09, RN-10, RN-20]
---

# US-03 — Carrinho de compras

## Narrativa
**Como** cliente
**Quero** gerenciar os produtos que pretendo comprar
**Para** revisar quantidades e valores antes de pagar

## Critérios de aceite

**AC-03.1 — Adicionar produto**
```gherkin
Dado que estou no catálogo ou na página de um produto disponível
Quando clico em "Adicionar ao carrinho"
Então o produto é incluído no carrinho
E o minicarrinho do cabeçalho atualiza a quantidade total de itens e o subtotal
```

**AC-03.2 — Limite de quantidade por produto**
```gherkin
Dado que um produto tem estoque maior que 10
Quando tento ter mais de 10 unidades dele no carrinho, por qualquer caminho
Então a quantidade fica limitada a 10
Dado que um produto tem estoque 3
Então não consigo ter mais de 3 unidades dele no carrinho
```

**AC-03.3 — Alterar quantidade**
```gherkin
Dado que tenho um produto no carrinho
Quando uso os botões "+" e "−"
Então a quantidade e os totais são recalculados imediatamente
E ao chegar a 0 o item é removido
```

**AC-03.4 — Remover item**
```gherkin
Dado que tenho itens no carrinho
Quando clico em "Remover"
Então o item sai do carrinho e os totais são recalculados
E se o carrinho ficar vazio vejo "Seu carrinho está vazio"
```

**AC-03.5 — Resumo do carrinho**
```gherkin
Dado que tenho itens no carrinho
Então vejo subtotal, desconto (quando houver cupom), frete (ou "Informe o CEP") e total
E todos os valores seguem o formato monetário brasileiro (RN-10)
```

## Restrições
- O carrinho é mantido apenas durante a sessão de navegação.

## Fora de escopo
- Salvar para depois / lista de desejos.

## Dependências
- US-04 (cupons) e US-05 (frete) compõem o resumo.

## Definition of Done
- [x] Critérios de aceite validados
- [x] Testes unitários de `carrinho.js`
