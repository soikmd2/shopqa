# Regras de Negócio — ShopQA v1.4

> Documento mantido pelo time de Produto. Fonte de verdade para regras transversais.
> Quando uma user story e este documento divergirem, **abra uma dúvida para o PO** antes de assumir qualquer lado.

| ID | Domínio | Regra |
|----|---------|-------|
| RN-01 | Catálogo | A busca considera apenas o **nome** do produto, ignora maiúsculas/minúsculas e acentos, e desconsidera espaços no início/fim do termo. Termo vazio exibe todo o catálogo. |
| RN-02 | Catálogo | Ordenação padrão: **mais vendidos**. Opções adicionais: menor preço, maior preço, nome (A-Z). |
| RN-03 | Catálogo | O contador de resultados respeita a concordância: “0 itens encontrados”, “1 item encontrado”, “N itens encontrados”. |
| RN-04 | Catálogo | Produto com estoque 0 exibe “Esgotado” e não pode ser adicionado ao carrinho. Estoque entre 1 e 5 exibe “Últimas N unidades”. |
| RN-05 | Avaliações | Apenas clientes autenticados avaliam. Nota obrigatória de 1 a 5. Comentário com 10 a 500 caracteres (após remover espaços das pontas). |
| RN-06 | Avaliações | O comentário aceita destaque em negrito com a marcação `**texto**`. **Qualquer outro conteúdo (incluindo tags HTML) deve ser exibido como texto literal**, nunca interpretado. |
| RN-07 | Avaliações | A média das notas é exibida com 1 casa decimal. |
| RN-08 | Carrinho | Quantidade máxima por produto: **10 unidades**, limitada também ao estoque disponível. O limite vale para **qualquer forma de inclusão** (card do catálogo, página do produto, botões do carrinho, inclusões repetidas). |
| RN-09 | Carrinho | Reduzir a quantidade para 0 remove o item do carrinho. |
| RN-10 | Geral | Todo valor monetário é exibido no padrão brasileiro: `R$ 1.234,56` — inclusive no minicarrinho do cabeçalho. |
| RN-11 | Cupons | Apenas **um cupom por pedido**. Para trocar de cupom, o cliente remove o atual e aplica outro. |
| RN-12 | Cupons | O código do cupom não diferencia maiúsculas/minúsculas e ignora espaços nas pontas. |
| RN-13 | Cupons | O cupom é válido até 23:59:59 da sua data de validade (inclusive). Após isso, exibir “Cupom expirado.” |
| RN-14 | Cupons | Cupons com valor mínimo são validados ao aplicar **e revalidados sempre que o carrinho mudar**. Se o subtotal ficar abaixo do mínimo, o cupom é removido automaticamente e o cliente é avisado. |
| RN-15 | Cupons | `PRIMEIRACOMPRA` só pode ser usado por cliente autenticado que **não possui nenhum pedido anterior** (qualquer status). |
| RN-16 | Cupons | Desconto de valor fixo nunca pode ser maior que o subtotal de produtos. |
| RN-17 | Frete | CEP válido possui **exatamente 8 dígitos**, aceito nos formatos `00000-000` ou `00000000`. |
| RN-18 | Frete | Valor e prazo por região (1º dígito do CEP): 0–1 SP R$ 14,90/2 dias · 2–3 RJ/ES/MG R$ 19,90/3 dias · 4–6 Nordeste/Norte R$ 29,90/6 dias · 7 Centro-Oeste/DF R$ 24,90/5 dias · 8–9 Sul R$ 22,90/4 dias. |
| RN-19 | Frete | Frete grátis quando o subtotal de produtos **após o desconto do cupom** for **maior ou igual a R$ 299,00**. O cupom `FRETEGRATIS` (mínimo R$ 150,00) também zera o frete. |
| RN-20 | Pedido | Ordem de cálculo: (1) subtotal → (2) desconto do cupom → (3) base = subtotal − cupom → (4) frete calculado sobre a base → (5) desconto PIX → (6) total = base + frete − desconto PIX. |
| RN-21 | Pagamento | PIX concede **5% de desconto sobre a base (produtos após cupom). O desconto PIX não incide sobre o frete.** Arredondamento: meio para cima, em centavos. |
| RN-22 | Pagamento | Cartão: até 10x sem juros, parcela mínima de R$ 20,00 (exceto 1x). **A soma das parcelas deve ser exatamente igual ao total**; a diferença de centavos é somada à 1ª parcela. O valor cobrado é sempre o total do pedido. |
| RN-23 | Pagamento | Cartão válido: 16 dígitos aprovados no algoritmo de Luhn, validade (MM/AA) não vencida, CVV com 3 dígitos e nome impresso com ao menos 3 caracteres. |
| RN-24 | Checkout | O checkout exige cliente autenticado. Ao entrar, o cliente retorna ao checkout com o carrinho preservado. |
| RN-25 | Checkout | Um clique em “Confirmar pedido” gera **no máximo um pedido**. O botão fica desabilitado enquanto o pagamento é processado. |
| RN-26 | Checkout | O estoque é validado no momento da confirmação; se insuficiente, o pedido não é criado e o cliente vê a quantidade disponível. Pedido confirmado decrementa o estoque. |
| RN-27 | Conta | Senha com no mínimo **8 caracteres**, ao menos 1 letra maiúscula e 1 número. |
| RN-28 | Conta | Após **5 tentativas de login inválidas consecutivas**, a conta é bloqueada por 15 minutos — a 5ª falha já bloqueia. A mensagem de erro é genérica (“E-mail ou senha inválidos.”) para não revelar se o e-mail existe. Login com sucesso zera o contador. |
| RN-29 | Conta | CPF deve ser válido (dígitos verificadores) e e-mail deve ser único na base. |
| RN-30 | Pedidos | “Meus pedidos” lista os pedidos do cliente do mais recente para o mais antigo, exibindo o valor efetivamente cobrado. |

## Cupons vigentes (tabela de referência)

| Código | Tipo | Valor | Mínimo | Validade | Observação |
|--------|------|-------|--------|----------|------------|
| PRIMEIRACOMPRA | Percentual | 10% | — | 31/12/2030 | Só primeira compra (RN-15) |
| BLACK50 | Fixo | R$ 50,00 | R$ 300,00 | 31/12/2030 | |
| FRETEGRATIS | Frete | Zera frete | R$ 150,00 | 31/12/2030 | |
| QA15 | Percentual | 15% | — | 31/12/2030 | Campanha comunidade QA |
| ANIVERSARIO20 | Percentual | 20% | — | 31/12/2025 | **Encerrado** |
| VERAO10 | Percentual | 10% | — | 01/03/2025 | **Encerrado** |
