---
id: US-04
titulo: Cupons de desconto
epico: EP-03 Promoções
prioridade: Should have
estimativa: 8 pontos
status: Done (Sprint 14)
regras: [RN-11, RN-12, RN-13, RN-14, RN-15, RN-16, RN-19]
---

# US-04 — Cupons de desconto

## Narrativa
**Como** cliente
**Quero** aplicar um cupom no carrinho
**Para** pagar menos nas minhas compras

## Contexto
Marketing distribui cupons por e-mail e redes sociais. Em 2025 tivemos prejuízo com o uso indevido de cupons de primeira compra por clientes recorrentes — a regra RN-15 precisa ser respeitada à risca.
Cupons não são cumulativos.

## Critérios de aceite

**AC-04.1 — Aplicar cupom válido**
```gherkin
Dado que tenho itens no carrinho
Quando informo "qa15" e clico em "Aplicar"
Então o cupom QA15 é aplicado
E vejo o desconto de 15% sobre o subtotal no resumo
```

**AC-04.2 — Cupom inexistente**
```gherkin
Quando informo "NAOEXISTE"
Então vejo "Cupom inválido." e nenhum desconto é aplicado
```

**AC-04.3 — Cupom expirado**
```gherkin
Dado que a data atual é posterior à validade do cupom
Quando informo o código do cupom
Então vejo "Cupom expirado." e nenhum desconto é aplicado
```

**AC-04.4 — Valor mínimo**
```gherkin
Dado que o subtotal é R$ 149,90
Quando aplico "BLACK50"
Então vejo "Este cupom exige compras a partir de R$ 300,00."
```

**AC-04.5 — Revalidação do valor mínimo**
```gherkin
Dado que apliquei "BLACK50" com subtotal de R$ 448,90
Quando removo itens e o subtotal fica abaixo de R$ 300,00
Então o cupom é removido automaticamente
E vejo um aviso informando o motivo
```

**AC-04.6 — Cupom de primeira compra**
```gherkin
Dado que estou autenticado e nunca fiz um pedido
Quando aplico "PRIMEIRACOMPRA"
Então recebo 10% de desconto
Dado que estou autenticado e já possuo pedido anterior
Quando aplico "PRIMEIRACOMPRA"
Então vejo "Cupom válido apenas para a primeira compra."
Dado que não estou autenticado
Então vejo "Faça login para usar este cupom."
```

**AC-04.7 — Cupom de frete**
```gherkin
Dado que o subtotal é maior ou igual a R$ 150,00
Quando aplico "FRETEGRATIS"
Então o frete do pedido fica "Grátis"
```

## Restrições
- O cupom fica associado ao carrinho e é enviado junto com o pedido.
- O desconto fixo nunca deixa o subtotal negativo (RN-16).

## Fora de escopo
- Cupons por categoria ou por produto.
- Painel administrativo de cupons.

## Dados de teste
Ver tabela “Cupons vigentes” em `regras-de-negocio.md`. Contas: `novo@shopqa.com` (0 pedidos), `cliente@shopqa.com` (1 pedido), `veterana@shopqa.com` (2 pedidos).
