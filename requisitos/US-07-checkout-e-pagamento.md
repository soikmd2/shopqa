---
id: US-07
titulo: Checkout e pagamento
epico: EP-02 Compra
prioridade: Must have
estimativa: 13 pontos
status: Done (Sprint 15)
regras: [RN-20, RN-21, RN-22, RN-23, RN-24, RN-25, RN-26]
---

# US-07 — Checkout e pagamento

## Narrativa
**Como** cliente autenticado
**Quero** informar endereço e forma de pagamento e confirmar o pedido
**Para** concluir minha compra

## Contexto
Checkout é o fluxo de maior risco financeiro. Em incidentes anteriores (INC-0412) tivemos **cobranças duplicadas** por clientes que clicavam várias vezes em “Confirmar” em conexões lentas.

## Critérios de aceite

**AC-07.1 — Acesso ao checkout**
```gherkin
Dado que não estou autenticado
Quando clico em "Finalizar compra"
Então sou levado ao login e, após entrar, volto ao checkout com o carrinho preservado
```

**AC-07.2 — Endereço**
```gherkin
Dado que estou no checkout
Então CEP, rua, número, bairro, cidade e UF são obrigatórios; complemento é opcional
E o botão "Confirmar pedido" só habilita com endereço e pagamento válidos
```

**AC-07.3 — Pagamento com PIX**
```gherkin
Dado um pedido com subtotal R$ 149,90, sem cupom, entregue em SP (frete R$ 14,90)
Quando escolho PIX
Então o desconto PIX é R$ 7,50 (5% de R$ 149,90)
E o total é R$ 157,30
```

**AC-07.4 — Pagamento com cartão**
```gherkin
Dado que escolho cartão de crédito
Quando informo cartão válido (RN-23)
Então vejo as opções de parcelamento de 1x até o máximo permitido (RN-22)
```

**AC-07.5 — Parcelas com centavos**
```gherkin
Dado um total de R$ 164,80 em 3x
Então as parcelas são 1x de R$ 54,94 + 2x de R$ 54,93
E o valor cobrado é R$ 164,80
```

**AC-07.6 — Confirmação única**
```gherkin
Dado que todos os dados estão válidos
Quando clico em "Confirmar pedido" (uma ou várias vezes)
Então o botão fica desabilitado com o texto "Processando pagamento..."
E exatamente um pedido é criado
E sou levado à página de confirmação
```

**AC-07.7 — Estoque insuficiente**
```gherkin
Dado que outro cliente comprou o produto e o estoque ficou menor que a quantidade do meu carrinho
Quando confirmo o pedido
Então vejo "Estoque insuficiente para "<produto>". Disponível: N."
E nenhum pedido é criado
```

## Restrições
- Gateway de pagamento simulado (sem cobrança real). Cartão de teste: `4111 1111 1111 1111`.
- O QR Code PIX é exibido após a confirmação e expira.

## Fora de escopo
- Boleto (previsto — ver PR-101), carteiras digitais, juros no parcelamento.

## Requisitos não funcionais relacionados
- RNF-01 (desempenho), RNF-02 (segurança), RNF-05 (resiliência).
