---
id: US-08
titulo: Histórico de pedidos
epico: EP-04 Conta do cliente
prioridade: Should have
estimativa: 3 pontos
status: Done (Sprint 15)
regras: [RN-30]
---

# US-08 — Histórico de pedidos

## Narrativa
**Como** cliente autenticado
**Quero** ver meus pedidos anteriores
**Para** acompanhar entregas e conferir valores pagos

## Critérios de aceite

**AC-08.1 — Listagem**
```gherkin
Dado que estou autenticado e tenho pedidos
Quando acesso "Meus pedidos"
Então vejo número, data, itens, forma de pagamento, total cobrado e status
E os pedidos estão do mais recente para o mais antigo
```

**AC-08.2 — Sem pedidos**
```gherkin
Dado que nunca fiz pedidos
Então vejo "Você ainda não fez pedidos."
```

**AC-08.3 — Isolamento entre clientes**
```gherkin
Dado que estou autenticado como "cliente@shopqa.com"
Então nunca vejo pedidos de outros clientes
```

**AC-08.4 — Acesso sem login**
```gherkin
Dado que não estou autenticado
Quando acesso "#/pedidos"
Então sou redirecionado ao login
```

## Restrições
- O cliente pode cancelar um pedido.

## Fora de escopo
- Rastreamento de entrega em tempo real; nota fiscal.
