---
id: US-09
titulo: Pagamento por boleto bancário
epico: EP-02 Compra
prioridade: Should have
estimativa: 5 pontos
status: In review (Sprint 16)
regras: [RN-20, RN-25, RN-26, RN-31, RN-32, RN-33]
---

# US-09 — Pagamento por boleto bancário

## Narrativa
**Como** cliente sem cartão de crédito
**Quero** pagar meu pedido com boleto
**Para** conseguir comprar na ShopQA

## Contexto
Pesquisa com clientes: 18% abandonam o checkout por não ter cartão e não usar PIX. Lançamento previsto para a Black Friday.

## Novas regras de negócio
| ID | Regra |
|----|-------|
| RN-31 | Boleto **não tem desconto** (o desconto de 5% é exclusivo do PIX) e não pode ser parcelado. |
| RN-32 | O boleto vence em **3 dias úteis** após a emissão (sábados, domingos e feriados nacionais não contam). |
| RN-33 | O estoque fica **reservado** até o vencimento. Boleto não pago até o vencimento → pedido “Cancelado” e estoque devolvido. |

## Critérios de aceite

**AC-09.1 — Escolher boleto**
```gherkin
Dado que estou no checkout com endereço válido
Quando escolho "Boleto bancário"
Então não preciso informar dados de cartão
E o botão "Confirmar pedido" fica habilitado
E o total é igual a subtotal − cupom + frete (sem desconto)
```

**AC-09.2 — Emissão**
```gherkin
Quando confirmo o pedido com boleto
Então vejo a linha digitável e a data de vencimento
E o pedido aparece em "Meus pedidos" com status "Aguardando pagamento" e forma de pagamento "Boleto"
```

**AC-09.3 — Vencimento em dias úteis**
```gherkin
Dado que emito o boleto numa sexta-feira
Então o vencimento é na quarta-feira seguinte
```

**AC-09.4 — Cancelamento por falta de pagamento** *(job noturno — fora deste PR)*
```gherkin
Dado um boleto vencido e não pago
Quando o job de conciliação roda
Então o pedido fica "Cancelado" e o estoque é devolvido
```

## Fora de escopo
- Integração bancária real (v1.6) · segunda via de boleto · boleto parcelado.
