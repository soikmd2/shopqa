---
id: US-10
titulo: Modalidades de entrega (expressa e retirada na loja)
epico: EP-04 Logística
prioridade: Could have
estimativa: 5 pontos
status: In review (Sprint 16)
regras: [RN-18, RN-19, RN-34, RN-35, RN-36]
---

# US-10 — Modalidades de entrega

## Narrativa
**Como** cliente
**Quero** escolher entre entrega padrão, expressa ou retirar na loja
**Para** receber mais rápido ou economizar no frete

## Novas regras de negócio
| ID | Regra |
|----|-------|
| RN-34 | **Expressa:** valor = tabela RN-18 × 1,8; prazo = metade do prazo padrão, arredondado para cima. **O frete grátis (RN-19 e cupom FRETEGRATIS) vale apenas para a entrega padrão** — a expressa é sempre cobrada. |
| RN-35 | **Retirada na loja:** disponível apenas para CEPs de SP (1º dígito 0 ou 1). Frete zero, pronto para retirada em 1 dia útil. **Não exige endereço de entrega** — apenas o CEP. |
| RN-36 | A modalidade escolhida aparece no resumo do carrinho, no checkout, na confirmação e em “Meus pedidos”. |

## Critérios de aceite

**AC-10.1 — Expressa**
```gherkin
Dado um pedido de R$ 149,90 para o CEP 90010-000 (Sul: R$ 22,90 / 4 dias)
Quando escolho entrega expressa
Então o frete é R$ 41,22 e o prazo é de 2 dias úteis
```

**AC-10.2 — Expressa não tem frete grátis**
```gherkin
Dado um pedido com base de R$ 4.299,00 para o CEP 01310-100
Quando escolho entrega expressa
Então o frete é R$ 26,82
```

**AC-10.3 — Retirada**
```gherkin
Dado que meu CEP é 01310-100
Quando escolho "Retirar na loja"
Então o frete é zero e os campos rua/número/bairro/cidade/UF ficam opcionais
```

**AC-10.4 — Retirada fora de SP**
```gherkin
Dado que meu CEP é 40010-000
Então a opção "Retirar na loja" não está disponível
```

## Fora de escopo
- Múltiplas lojas · agendamento de retirada · rastreamento.
