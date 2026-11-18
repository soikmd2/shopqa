# Relatório de risco — PR #101 (pagamento por boleto)

> Exemplo de saída “bem-feita” do prompt 03, revisada por um QA humano. Usada na demonstração ao vivo e como referência válida para o portão do Desafio 3.

## 1. Resumo da mudança
Adiciona boleto como forma de pagamento, gera linha digitável e vencimento, e muda o status inicial do pedido. **Diferença entre descrição e código:** a descrição diz que “pagamentos à vista compartilham a mesma lógica” — na prática o boleto passou a receber o desconto de 5% exclusivo do PIX (contraria RN-31).

## 2. Mapa de impacto
- `resumo.js › calcularResumo` → Carrinho, Checkout, valor gravado no pedido (todo o fluxo financeiro).
- `pagamento.js › calcularVencimentoBoleto` → Confirmação.
- `api.js › criarPedido` → estoque, status, Meus pedidos.
- **Deveriam ter mudado e não mudaram:** `Pedidos.jsx` e a linha “Pagamento” de `Confirmacao.jsx` (exibem “Cartão nullx” para boleto); job de cancelamento de boletos vencidos (RN-33, fora do PR).

## 3. Matriz de riscos
| ID | Risco | Evidência | Regra | P | I | Nível |
|----|-------|-----------|-------|---|---|-------|
| R1 | Boleto recebe 5% de desconto | `resumo.js`: `const aVista = formaPagamento !== 'cartao'` | RN-31 | 3 | 3 | 9 |
| R2 | Vencimento em dias corridos | `pagamento.js`: `setDate(getDate() + 3)` | RN-32 | 3 | 2 | 6 |
| R3 | “Cartão nullx” em Meus pedidos/Confirmação | `Pedidos.jsx` fora do diff | AC-09.2 | 3 | 2 | 6 |
| R4 | Estoque preso por boletos não pagos | `api.js` decrementa estoque sem expiração | RN-33 | 2 | 3 | 6 |
| R5 | Texto “Desconto PIX” renomeado quebra TCs | `Checkout.jsx` | — | 3 | 1 | 3 |

## 4. Testes recomendados
- **R1:** `novo@shopqa.com`, Bola de Futebol (R$ 149,90), CEP 01310-100, boleto → total **R$ 164,80** (149,90 + 14,90, sem desconto). Suíte atual cobre? Não.
- **R2:** emitir com data simulada sexta 20/11/2026 → vencimento **quarta 25/11/2026**. Cobre? Não.
- **R3:** após R1, abrir Meus pedidos → coluna Pagamento exibe **“Boleto”**. Cobre? Não.
- **R4:** 3 boletos de 1 Tênis (estoque 3) → 4º cliente vê “Esgotado”; após o vencimento, estoque volta a 3 (depende do job). Cobre? Não.

## 5. Lacunas na suíte automatizada
A suíte `tests/regras` não tem nenhum teste com `formaPagamento` diferente de `cartao`/`pix` e não testa telas. Os 36 testes passam porque nenhum deles exercita o código novo.

## 6. Recomendação
**BLOQUEAR.** Bloqueantes: R1 (prejuízo de 5% por pedido), R2 e R3. R4 exige decisão do PO sobre lançar sem o job de cancelamento.
