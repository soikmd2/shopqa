---
id: US-02
titulo: Página do produto e avaliações de clientes
epico: EP-01 Descoberta de produtos
prioridade: Should have
estimativa: 8 pontos
status: Done (Sprint 13)
regras: [RN-04, RN-05, RN-06, RN-07, RN-08]
---

# US-02 — Página do produto e avaliações de clientes

## Narrativa
**Como** cliente
**Quero** ver os detalhes de um produto e as opiniões de outros clientes
**Para** decidir a compra com mais segurança

## Contexto
Avaliações aumentam a conversão. O time de marketing pediu que o cliente possa **destacar trechos em negrito** nos comentários.
As avaliações mais relevantes devem aparecer primeiro.

## Critérios de aceite

**AC-02.1 — Detalhes do produto**
```gherkin
Dado que acesso a página de um produto
Então vejo nome, categoria, descrição, preço, preço no PIX e a quantidade em estoque
```

**AC-02.2 — Seleção de quantidade**
```gherkin
Dado que estou na página de um produto disponível
Então posso escolher uma quantidade entre 1 e o limite permitido (RN-08)
E ao clicar "Adicionar ao carrinho" a quantidade escolhida é incluída
```

**AC-02.3 — Publicar avaliação**
```gherkin
Dado que estou autenticado
Quando seleciono uma nota e escrevo um comentário válido
E clico em "Publicar avaliação"
Então a avaliação aparece na lista com meu nome e a data
```

**AC-02.4 — Validações da avaliação**
```gherkin
Dado que estou autenticado
Quando tento publicar sem nota, ou com comentário menor que 10 ou maior que 500 caracteres
Então vejo a mensagem de erro correspondente e a avaliação não é publicada
```

**AC-02.5 — Formatação do comentário**
```gherkin
Dado um comentário "Som **excelente**"
Então a palavra "excelente" aparece em negrito
Dado um comentário contendo "<b>oi</b>" ou "<script>"
Então o texto aparece literalmente, sem ser interpretado como HTML
```

**AC-02.6 — Visitante não autenticado**
```gherkin
Dado que não estou autenticado
Então vejo o link "Entre para avaliar este produto" no lugar do formulário
```

## Restrições
- Um cliente pode publicar várias avaliações para o mesmo produto (moderação fica para a v2).
- Avaliações não podem ser editadas nem excluídas nesta versão.

## Fora de escopo
- Fotos nas avaliações; “avaliação útil”.

## Requisitos não funcionais relacionados
- RNF-02 (segurança — OWASP Top 10), RNF-03 (acessibilidade).

## Definition of Done
- [x] Critérios de aceite validados
- [ ] Revisão de segurança do campo de comentário *(pendente — time de segurança sem agenda)*
