# Casos de teste — ShopQA v1.4

> Gerado automaticamente a partir de `casos-de-teste.json` (fonte de verdade). Não edite este arquivo à mão.

**Total:** 50 casos · por prioridade — alta: 21, media: 21, baixa: 5, critica: 3 · por tipo — funcional: 26, negativo: 14, seguranca: 4, limite: 5, usabilidade: 1

| ID | Título | US / AC | Tipo | Prioridade |
|----|--------|---------|------|------------|
| [TC-CAT-001](#tc-cat-001) | Buscar produto pelo nome exato | US-01 / AC-01.1 | funcional | alta |
| [TC-CAT-002](#tc-cat-002) | Buscar produto com termo em letras minúsculas | US-01 / AC-01.1 | funcional | alta |
| [TC-CAT-003](#tc-cat-003) | Buscar produto ignorando acentos | US-01 / AC-01.1 | funcional | media |
| [TC-CAT-004](#tc-cat-004) | Busca sem resultados exibe mensagem e contador zerado | US-01 / AC-01.2 | negativo | media |
| [TC-CAT-005](#tc-cat-005) | Filtrar por categoria combinado com busca | US-01 / AC-01.3 | funcional | media |
| [TC-CAT-006](#tc-cat-006) | Ordenar por menor preço | US-01 / AC-01.4 | funcional | media |
| [TC-CAT-007](#tc-cat-007) | Produto sem estoque não pode ser adicionado | US-01 / AC-01.6 | negativo | alta |
| [TC-PRD-001](#tc-prd-001) | Exibir detalhes do produto | US-02 / AC-02.1 | funcional | media |
| [TC-PRD-002](#tc-prd-002) | Comentário com **negrito** é formatado | US-02 / AC-02.5 | funcional | baixa |
| [TC-PRD-003](#tc-prd-003) | Comentário com menos de 10 caracteres é rejeitado | US-02 / AC-02.4 | negativo | media |
| [TC-PRD-004](#tc-prd-004) | Visitante não vê formulário de avaliação | US-02 / AC-02.6 | funcional | baixa |
| [TC-PRD-005](#tc-prd-005) | HTML no comentário é exibido como texto literal | US-02 / AC-02.5 | seguranca | critica |
| [TC-CAR-001](#tc-car-001) | Adicionar produto atualiza minicarrinho | US-03 / AC-03.1 | funcional | alta |
| [TC-CAR-002](#tc-car-002) | Botão + respeita o estoque disponível | US-03 / AC-03.2 | limite | alta |
| [TC-CAR-003](#tc-car-003) | Limite de 10 unidades ao adicionar repetidamente pela página do produto | US-03 / AC-03.2 | limite | alta |
| [TC-CAR-004](#tc-car-004) | Diminuir quantidade até zero remove o item | US-03 / AC-03.3 | funcional | media |
| [TC-CAR-005](#tc-car-005) | Remover item recalcula totais | US-03 / AC-03.4 | funcional | media |
| [TC-CAR-006](#tc-car-006) | Minicarrinho exibe valor no formato brasileiro | US-03 / AC-03.1 | usabilidade | baixa |
| [TC-CUP-001](#tc-cup-001) | Aplicar cupom válido em minúsculas | US-04 / AC-04.1 | funcional | alta |
| [TC-CUP-002](#tc-cup-002) | Cupom inexistente | US-04 / AC-04.2 | negativo | media |
| [TC-CUP-003](#tc-cup-003) | Cupom VERAO10 encerrado é recusado | US-04 / AC-04.3 | negativo | media |
| [TC-CUP-004](#tc-cup-004) | Cupom ANIVERSARIO20 encerrado é recusado | US-04 / AC-04.3 | negativo | alta |
| [TC-CUP-005](#tc-cup-005) | BLACK50 abaixo do valor mínimo | US-04 / AC-04.4 | limite | media |
| [TC-CUP-006](#tc-cup-006) | BLACK50 é removido quando o subtotal cai abaixo do mínimo | US-04 / AC-04.5 | funcional | alta |
| [TC-CUP-007](#tc-cup-007) | PRIMEIRACOMPRA para cliente sem pedidos | US-04 / AC-04.6 | funcional | alta |
| [TC-CUP-008](#tc-cup-008) | PRIMEIRACOMPRA recusado para cliente com 1 pedido anterior | US-04 / AC-04.6 | limite | critica |
| [TC-CUP-009](#tc-cup-009) | PRIMEIRACOMPRA recusado para cliente com vários pedidos | US-04 / AC-04.6 | negativo | alta |
| [TC-CUP-010](#tc-cup-010) | PRIMEIRACOMPRA exige login | US-04 / AC-04.6 | negativo | media |
| [TC-FRT-001](#tc-frt-001) | Frete para CEP de SP | US-05 / AC-05.1 | funcional | alta |
| [TC-FRT-002](#tc-frt-002) | Frete para CEP do Sul sem hífen | US-05 / AC-05.2 | funcional | media |
| [TC-FRT-003](#tc-frt-003) | Frete grátis com subtotal exatamente igual a R$ 299,00 | US-05 / AC-05.3 | limite | alta |
| [TC-FRT-004](#tc-frt-004) | Cupom FRETEGRATIS zera o frete | US-05 / AC-05.4 | funcional | media |
| [TC-FRT-005](#tc-frt-005) | CEP com 7 dígitos é rejeitado | US-05 / AC-05.2 | negativo | media |
| [TC-FRT-006](#tc-frt-006) | CEP com letras é rejeitado | US-05 / AC-05.2 | negativo | baixa |
| [TC-AUT-001](#tc-aut-001) | Cadastro com dados válidos | US-06 / AC-06.1 | funcional | alta |
| [TC-AUT-002](#tc-aut-002) | Senha sem maiúscula é rejeitada | US-06 / AC-06.2 | negativo | media |
| [TC-AUT-003](#tc-aut-003) | E-mail já cadastrado com outra capitalização | US-06 / AC-06.3 | negativo | media |
| [TC-AUT-004](#tc-aut-004) | Login com credenciais válidas | US-06 / AC-06.4 | funcional | alta |
| [TC-AUT-005](#tc-aut-005) | Conta é bloqueada na 5ª tentativa inválida | US-06 / AC-06.5 | seguranca | alta |
| [TC-AUT-006](#tc-aut-006) | Mensagem genérica para e-mail inexistente | US-06 / AC-06.6 | seguranca | media |
| [TC-CHK-001](#tc-chk-001) | Checkout sem login redireciona e preserva carrinho | US-07 / AC-07.1 | funcional | alta |
| [TC-CHK-002](#tc-chk-002) | Botão de confirmação desabilitado com endereço incompleto | US-07 / AC-07.2 | negativo | media |
| [TC-CHK-003](#tc-chk-003) | Desconto PIX não incide sobre o frete | US-07 / AC-07.3 | funcional | alta |
| [TC-CHK-004](#tc-chk-004) | Cartão com número inválido (Luhn) não habilita confirmação | US-07 / AC-07.4 | negativo | alta |
| [TC-CHK-005](#tc-chk-005) | Parcelamento em 3x com centavos soma o total exato | US-07 / AC-07.5 | funcional | alta |
| [TC-CHK-006](#tc-chk-006) | Estoque insuficiente na confirmação | US-07 / AC-07.7 | funcional | alta |
| [TC-CHK-007](#tc-chk-007) | Duplo clique em Confirmar gera um único pedido | US-07 / AC-07.6 | funcional | critica |
| [TC-PED-001](#tc-ped-001) | Pedidos ordenados do mais recente | US-08 / AC-08.1 | funcional | media |
| [TC-PED-002](#tc-ped-002) | Cliente sem pedidos | US-08 / AC-08.2 | funcional | baixa |
| [TC-PED-003](#tc-ped-003) | Acesso a pedidos sem login | US-08 / AC-08.4 | seguranca | media |

---

## US-01

### TC-CAT-001
**Buscar produto pelo nome exato**

- **Rastreabilidade:** US-01 · AC-01.1 · RN-01
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Estar no catálogo (#/)
- **Dados:** termo: Fone Bluetooth Pro

**Passos**
1. Digitar "Fone Bluetooth Pro" no campo de busca

**Resultado esperado:** Apenas o card "Fone Bluetooth Pro" é exibido e o contador mostra "1 item encontrado".

### TC-CAT-002
**Buscar produto com termo em letras minúsculas**

- **Rastreabilidade:** US-01 · AC-01.1 · RN-01
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Estar no catálogo (#/)
- **Dados:** termo: fone

**Passos**
1. Digitar "fone" no campo de busca

**Resultado esperado:** O card "Fone Bluetooth Pro" é exibido e o contador mostra "1 item encontrado".

### TC-CAT-003
**Buscar produto ignorando acentos**

- **Rastreabilidade:** US-01 · AC-01.1 · RN-01
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Estar no catálogo (#/)
- **Dados:** termo: Luminaria

**Passos**
1. Digitar "Luminaria" (sem acento) no campo de busca

**Resultado esperado:** O card "Luminária de Mesa LED" é exibido.

### TC-CAT-004
**Busca sem resultados exibe mensagem e contador zerado**

- **Rastreabilidade:** US-01 · AC-01.2 · RN-03
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Estar no catálogo (#/)
- **Dados:** termo: geladeira

**Passos**
1. Digitar "geladeira" no campo de busca

**Resultado esperado:** Exibe "Nenhum produto encontrado para “geladeira”." e o contador mostra exatamente "0 itens encontrados".

### TC-CAT-005
**Filtrar por categoria combinado com busca**

- **Rastreabilidade:** US-01 · AC-01.3 · RN-01
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Estar no catálogo (#/)
- **Dados:** categoria: Livros · termo: Livro

**Passos**
1. Selecionar a categoria "Livros"
2. Digitar "Livro" na busca

**Resultado esperado:** São exibidos somente os 2 produtos da categoria Livros e o contador mostra "2 itens encontrados".

### TC-CAT-006
**Ordenar por menor preço**

- **Rastreabilidade:** US-01 · AC-01.4 · RN-02
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Estar no catálogo (#/)
- **Dados:** ordenacao: Menor preço

**Passos**
1. Selecionar a ordenação "Menor preço"

**Resultado esperado:** O primeiro card é "Livro: Testes de Software na Prática" (R$ 59,90) e o último é "Notebook Ultra 14\"" (R$ 4.299,00); preços em ordem crescente.

### TC-CAT-007
**Produto sem estoque não pode ser adicionado**

- **Rastreabilidade:** US-01 · AC-01.6 · RN-04
- **Tipo / prioridade:** negativo / alta · automatizável: sim
- **Pré-condições:** Dados de demonstração restaurados
- **Dados:** produto: Livro: Inteligência Artificial para Iniciantes (estoque 0)

**Passos**
1. Localizar o card do produto no catálogo

**Resultado esperado:** O card exibe "Esgotado" e o botão "Adicionar ao carrinho" está desabilitado.

---

## US-02

### TC-PRD-001
**Exibir detalhes do produto**

- **Rastreabilidade:** US-02 · AC-02.1 · RN-04
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** —
- **Dados:** produto: #/produto/2

**Passos**
1. Acessar #/produto/2

**Resultado esperado:** Exibe nome "Smartwatch Fit 2", categoria, descrição, preço R$ 649,90, preço PIX R$ 617,41 e "12 em estoque".

### TC-PRD-002
**Comentário com **negrito** é formatado**

- **Rastreabilidade:** US-02 · AC-02.5 · RN-06
- **Tipo / prioridade:** funcional / baixa · automatizável: sim
- **Pré-condições:** Estar autenticado como novo@shopqa.com
- **Dados:** comentario: Produto **muito** bom, recomendo

**Passos**
1. Acessar #/produto/8
2. Selecionar nota 5
3. Digitar o comentário
4. Clicar em "Publicar avaliação"

**Resultado esperado:** A avaliação é publicada e a palavra "muito" aparece em negrito, sem os asteriscos.

### TC-PRD-003
**Comentário com menos de 10 caracteres é rejeitado**

- **Rastreabilidade:** US-02 · AC-02.4 · RN-05
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Estar autenticado
- **Dados:** comentario: Bom · nota: 4

**Passos**
1. Acessar a página de um produto
2. Selecionar nota 4
3. Digitar "Bom"
4. Clicar em "Publicar avaliação"

**Resultado esperado:** Exibe "O comentário deve ter ao menos 10 caracteres." e a avaliação não é publicada.

### TC-PRD-004
**Visitante não vê formulário de avaliação**

- **Rastreabilidade:** US-02 · AC-02.6 · RN-05
- **Tipo / prioridade:** funcional / baixa · automatizável: sim
- **Pré-condições:** Não estar autenticado
- **Dados:** —

**Passos**
1. Acessar #/produto/1

**Resultado esperado:** O formulário não é exibido; aparece "Entre para avaliar este produto." com link para o login.

### TC-PRD-005
**HTML no comentário é exibido como texto literal**

- **Rastreabilidade:** US-02 · AC-02.5 · RN-06
- **Tipo / prioridade:** seguranca / critica · automatizável: sim
- **Pré-condições:** Estar autenticado como novo@shopqa.com
- **Dados:** comentario: Gostei <img src=x onerror=alert('xss')> demais

**Passos**
1. Acessar #/produto/6
2. Selecionar nota 5
3. Digitar o comentário
4. Clicar em "Publicar avaliação"
5. Recarregar a página

**Resultado esperado:** O comentário aparece com o texto literal "<img src=x onerror=alert('xss')>"; nenhum alerta/script é executado, nem na publicação nem ao recarregar.

---

## US-03

### TC-CAR-001
**Adicionar produto atualiza minicarrinho**

- **Rastreabilidade:** US-03 · AC-03.1 · RN-10
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Carrinho vazio
- **Dados:** produto: Mouse Óptico Sem Fio

**Passos**
1. No catálogo, clicar em "Adicionar ao carrinho" do Mouse Óptico Sem Fio

**Resultado esperado:** O badge do minicarrinho mostra 1 e é exibido o aviso "\"Mouse Óptico Sem Fio\" adicionado ao carrinho.".

### TC-CAR-002
**Botão + respeita o estoque disponível**

- **Rastreabilidade:** US-03 · AC-03.2 · RN-08
- **Tipo / prioridade:** limite / alta · automatizável: sim
- **Pré-condições:** Carrinho com 1 "Tênis de Corrida Ágil" (estoque 3)
- **Dados:** —

**Passos**
1. Acessar #/carrinho
2. Clicar em "+" três vezes

**Resultado esperado:** A quantidade para em 3 e o botão "+" fica desabilitado.

### TC-CAR-003
**Limite de 10 unidades ao adicionar repetidamente pela página do produto**

- **Rastreabilidade:** US-03 · AC-03.2 · RN-08
- **Tipo / prioridade:** limite / alta · automatizável: sim
- **Pré-condições:** Carrinho vazio
- **Dados:** produto: #/produto/4 (estoque 60) · quantidade: 10

**Passos**
1. Acessar #/produto/4
2. Informar quantidade 10
3. Clicar em "Adicionar ao carrinho"
4. Clicar novamente em "Adicionar ao carrinho"
5. Acessar #/carrinho

**Resultado esperado:** O carrinho contém no máximo 10 unidades do Mouse Óptico Sem Fio (subtotal R$ 899,00).

### TC-CAR-004
**Diminuir quantidade até zero remove o item**

- **Rastreabilidade:** US-03 · AC-03.3 · RN-09
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Carrinho com 1 "Garrafa Térmica 1L"
- **Dados:** —

**Passos**
1. Acessar #/carrinho
2. Clicar em "−"

**Resultado esperado:** O item é removido e é exibido "Seu carrinho está vazio".

### TC-CAR-005
**Remover item recalcula totais**

- **Rastreabilidade:** US-03 · AC-03.4 · RN-20
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Carrinho com Cafeteira Elétrica (R$ 199,00) e Mouse (R$ 89,90)
- **Dados:** —

**Passos**
1. Acessar #/carrinho
2. Clicar em "Remover" no Mouse

**Resultado esperado:** Subtotal e total passam a R$ 199,00 (sem CEP informado).

### TC-CAR-006
**Minicarrinho exibe valor no formato brasileiro**

- **Rastreabilidade:** US-03 · AC-03.1 · RN-10
- **Tipo / prioridade:** usabilidade / baixa · automatizável: sim
- **Pré-condições:** Carrinho vazio
- **Dados:** produto: Cadeira Ergonômica Office (R$ 1.299,90)

**Passos**
1. Adicionar a Cadeira Ergonômica Office ao carrinho
2. Observar o valor no minicarrinho do cabeçalho

**Resultado esperado:** O minicarrinho exibe "R$ 1.299,90".

---

## US-04

### TC-CUP-001
**Aplicar cupom válido em minúsculas**

- **Rastreabilidade:** US-04 · AC-04.1 · RN-12
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Carrinho com Cafeteira Elétrica (R$ 199,00)
- **Dados:** cupom:   qa15 

**Passos**
1. Acessar #/carrinho
2. Informar o cupom com espaços e minúsculas
3. Clicar em "Aplicar"

**Resultado esperado:** Cupom QA15 aplicado; desconto de R$ 29,85 e total sem frete de R$ 169,15.

### TC-CUP-002
**Cupom inexistente**

- **Rastreabilidade:** US-04 · AC-04.2 · RN-12
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Carrinho com qualquer item
- **Dados:** cupom: NAOEXISTE

**Passos**
1. Informar NAOEXISTE e clicar em "Aplicar"

**Resultado esperado:** Exibe "Cupom inválido." e nenhum desconto aparece no resumo.

### TC-CUP-003
**Cupom VERAO10 encerrado é recusado**

- **Rastreabilidade:** US-04 · AC-04.3 · RN-13
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Carrinho com qualquer item
- **Dados:** cupom: VERAO10 · validade: 01/03/2025

**Passos**
1. Informar VERAO10 e clicar em "Aplicar"

**Resultado esperado:** Exibe "Cupom expirado." e nenhum desconto é aplicado.

### TC-CUP-004
**Cupom ANIVERSARIO20 encerrado é recusado**

- **Rastreabilidade:** US-04 · AC-04.3 · RN-13
- **Tipo / prioridade:** negativo / alta · automatizável: sim
- **Pré-condições:** Carrinho com qualquer item
- **Dados:** cupom: ANIVERSARIO20 · validade: 31/12/2025

**Passos**
1. Informar ANIVERSARIO20 e clicar em "Aplicar"

**Resultado esperado:** Exibe "Cupom expirado." e nenhum desconto é aplicado.

### TC-CUP-005
**BLACK50 abaixo do valor mínimo**

- **Rastreabilidade:** US-04 · AC-04.4 · RN-14
- **Tipo / prioridade:** limite / media · automatizável: sim
- **Pré-condições:** Carrinho com Bola de Futebol Oficial (R$ 149,90)
- **Dados:** cupom: BLACK50

**Passos**
1. Informar BLACK50 e clicar em "Aplicar"

**Resultado esperado:** Exibe "Este cupom exige compras a partir de R$ 300,00.".

### TC-CUP-006
**BLACK50 é removido quando o subtotal cai abaixo do mínimo**

- **Rastreabilidade:** US-04 · AC-04.5 · RN-14
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Carrinho com Fone Bluetooth Pro (R$ 299,00) e Bola de Futebol Oficial (R$ 149,90)
- **Dados:** cupom: BLACK50

**Passos**
1. Aplicar o cupom BLACK50
2. Remover o Fone Bluetooth Pro do carrinho

**Resultado esperado:** O cupom BLACK50 é removido automaticamente, um aviso explica o motivo e o total volta a R$ 149,90 (sem CEP).

### TC-CUP-007
**PRIMEIRACOMPRA para cliente sem pedidos**

- **Rastreabilidade:** US-04 · AC-04.6 · RN-15
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Autenticado como novo@shopqa.com (0 pedidos); Carrinho com Cafeteira Elétrica
- **Dados:** cupom: PRIMEIRACOMPRA

**Passos**
1. Aplicar o cupom PRIMEIRACOMPRA

**Resultado esperado:** Cupom aplicado com desconto de R$ 19,90.

### TC-CUP-008
**PRIMEIRACOMPRA recusado para cliente com 1 pedido anterior**

- **Rastreabilidade:** US-04 · AC-04.6 · RN-15
- **Tipo / prioridade:** limite / critica · automatizável: sim
- **Pré-condições:** Autenticado como cliente@shopqa.com (1 pedido); Carrinho com Cafeteira Elétrica
- **Dados:** cupom: PRIMEIRACOMPRA

**Passos**
1. Aplicar o cupom PRIMEIRACOMPRA

**Resultado esperado:** Exibe "Cupom válido apenas para a primeira compra." e nenhum desconto é aplicado.

### TC-CUP-009
**PRIMEIRACOMPRA recusado para cliente com vários pedidos**

- **Rastreabilidade:** US-04 · AC-04.6 · RN-15
- **Tipo / prioridade:** negativo / alta · automatizável: sim
- **Pré-condições:** Autenticado como veterana@shopqa.com (2 pedidos); Carrinho com Cafeteira Elétrica
- **Dados:** cupom: PRIMEIRACOMPRA

**Passos**
1. Aplicar o cupom PRIMEIRACOMPRA

**Resultado esperado:** Exibe "Cupom válido apenas para a primeira compra.".

### TC-CUP-010
**PRIMEIRACOMPRA exige login**

- **Rastreabilidade:** US-04 · AC-04.6 · RN-15
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Não autenticado; Carrinho com qualquer item
- **Dados:** cupom: PRIMEIRACOMPRA

**Passos**
1. Aplicar o cupom PRIMEIRACOMPRA

**Resultado esperado:** Exibe "Faça login para usar este cupom.".

---

## US-05

### TC-FRT-001
**Frete para CEP de SP**

- **Rastreabilidade:** US-05 · AC-05.1 · RN-18
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Carrinho com Mouse (R$ 89,90)
- **Dados:** cep: 01310-100

**Passos**
1. Informar o CEP e clicar em "Calcular"

**Resultado esperado:** Exibe "SP: R$ 14,90 · entrega em até 2 dias úteis" e total R$ 104,80.

### TC-FRT-002
**Frete para CEP do Sul sem hífen**

- **Rastreabilidade:** US-05 · AC-05.2 · RN-17, RN-18
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Carrinho com Mouse (R$ 89,90)
- **Dados:** cep: 90010000

**Passos**
1. Informar o CEP e clicar em "Calcular"

**Resultado esperado:** Exibe "Sul: R$ 22,90 · entrega em até 4 dias úteis".

### TC-FRT-003
**Frete grátis com subtotal exatamente igual a R$ 299,00**

- **Rastreabilidade:** US-05 · AC-05.3 · RN-19
- **Tipo / prioridade:** limite / alta · automatizável: sim
- **Pré-condições:** Carrinho somente com Fone Bluetooth Pro (R$ 299,00)
- **Dados:** cep: 01310-100

**Passos**
1. Informar o CEP e clicar em "Calcular"

**Resultado esperado:** O frete é exibido como "Frete grátis" e o total é R$ 299,00.

### TC-FRT-004
**Cupom FRETEGRATIS zera o frete**

- **Rastreabilidade:** US-05 · AC-05.4 · RN-19
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Carrinho com Bola de Futebol Oficial (R$ 149,90)
- **Dados:** cupom: FRETEGRATIS · cep: 69005-000

**Passos**
1. Aplicar FRETEGRATIS
2. Calcular o frete para o CEP

**Resultado esperado:** Frete "Grátis" e total R$ 149,90.

### TC-FRT-005
**CEP com 7 dígitos é rejeitado**

- **Rastreabilidade:** US-05 · AC-05.2 · RN-17
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Carrinho com qualquer item
- **Dados:** cep: 0131010

**Passos**
1. Informar o CEP e clicar em "Calcular"

**Resultado esperado:** Exibe "CEP inválido. Use o formato 00000-000." e nenhum frete é calculado.

### TC-FRT-006
**CEP com letras é rejeitado**

- **Rastreabilidade:** US-05 · AC-05.2 · RN-17
- **Tipo / prioridade:** negativo / baixa · automatizável: sim
- **Pré-condições:** Carrinho com qualquer item
- **Dados:** cep: ABCDE-123

**Passos**
1. Informar o CEP e clicar em "Calcular"

**Resultado esperado:** O campo aceita apenas dígitos ou exibe "CEP inválido. Use o formato 00000-000."; nenhum frete é calculado.

---

## US-06

### TC-AUT-001
**Cadastro com dados válidos**

- **Rastreabilidade:** US-06 · AC-06.1 · RN-27, RN-29
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Não autenticado
- **Dados:** nome: Teste Silva · email: teste.silva@shopqa.com · cpf: 935.411.347-80 · senha: Senha123

**Passos**
1. Acessar #/cadastro
2. Preencher todos os campos com os dados
3. Aceitar os termos
4. Clicar em "Criar conta"

**Resultado esperado:** A conta é criada e o cabeçalho exibe "Olá, Teste".

### TC-AUT-002
**Senha sem maiúscula é rejeitada**

- **Rastreabilidade:** US-06 · AC-06.2 · RN-27
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Não autenticado
- **Dados:** senha: senha1234

**Passos**
1. Preencher o cadastro com a senha informada
2. Clicar em "Criar conta"

**Resultado esperado:** Exibe "A senha precisa de: ao menos 1 letra maiúscula." e a conta não é criada.

### TC-AUT-003
**E-mail já cadastrado com outra capitalização**

- **Rastreabilidade:** US-06 · AC-06.3 · RN-29
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Não autenticado
- **Dados:** email: CLIENTE@shopqa.com · cpf: 935.411.347-80

**Passos**
1. Preencher o cadastro com o e-mail informado e demais dados válidos
2. Clicar em "Criar conta"

**Resultado esperado:** Exibe "Já existe uma conta com este e-mail.".

### TC-AUT-004
**Login com credenciais válidas**

- **Rastreabilidade:** US-06 · AC-06.4 · RN-28
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Não autenticado
- **Dados:** email: cliente@shopqa.com · senha: Senha123

**Passos**
1. Acessar #/login
2. Informar e-mail e senha
3. Clicar em "Entrar"

**Resultado esperado:** O cabeçalho exibe "Olá, Ana" e os links "Meus pedidos" e "Sair".

### TC-AUT-005
**Conta é bloqueada na 5ª tentativa inválida**

- **Rastreabilidade:** US-06 · AC-06.5 · RN-28
- **Tipo / prioridade:** seguranca / alta · automatizável: sim
- **Pré-condições:** Dados de demonstração restaurados (contador zerado)
- **Dados:** email: bloqueio@shopqa.com · senhaErrada: Errada000

**Passos**
1. Tentar entrar 5 vezes seguidas com a senha errada

**Resultado esperado:** Na 5ª tentativa é exibido "Conta bloqueada temporariamente por excesso de tentativas. Tente novamente em 15 minutos.".

### TC-AUT-006
**Mensagem genérica para e-mail inexistente**

- **Rastreabilidade:** US-06 · AC-06.6 · RN-28
- **Tipo / prioridade:** seguranca / media · automatizável: sim
- **Pré-condições:** Não autenticado
- **Dados:** email: ninguem@shopqa.com · senha: Senha123

**Passos**
1. Tentar entrar com o e-mail inexistente

**Resultado esperado:** Exibe "E-mail ou senha inválidos." (mesma mensagem de senha errada).

---

## US-07

### TC-CHK-001
**Checkout sem login redireciona e preserva carrinho**

- **Rastreabilidade:** US-07 · AC-07.1 · RN-24
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Não autenticado; Carrinho com Mouse
- **Dados:** email: novo@shopqa.com · senha: Senha123

**Passos**
1. No carrinho, clicar em "Finalizar compra"
2. Entrar com a conta informada

**Resultado esperado:** Após o login o cliente volta ao checkout e o Mouse continua no resumo.

### TC-CHK-002
**Botão de confirmação desabilitado com endereço incompleto**

- **Rastreabilidade:** US-07 · AC-07.2 · RN-23
- **Tipo / prioridade:** negativo / media · automatizável: sim
- **Pré-condições:** Autenticado; Carrinho com qualquer item
- **Dados:** endereco: apenas CEP preenchido · pagamento: PIX

**Passos**
1. Acessar #/checkout
2. Preencher somente o CEP
3. Escolher PIX

**Resultado esperado:** O botão "Confirmar pedido" permanece desabilitado.

### TC-CHK-003
**Desconto PIX não incide sobre o frete**

- **Rastreabilidade:** US-07 · AC-07.3 · RN-20, RN-21
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Autenticado como novo@shopqa.com; Carrinho somente com Bola de Futebol Oficial (R$ 149,90)
- **Dados:** endereco: {"cep":"01310-100","rua":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","uf":"SP"} · pagamento: PIX

**Passos**
1. Acessar #/checkout
2. Preencher o endereço
3. Escolher PIX
4. Conferir o resumo

**Resultado esperado:** Subtotal R$ 149,90; frete R$ 14,90; desconto PIX R$ 7,50; total R$ 157,30.

### TC-CHK-004
**Cartão com número inválido (Luhn) não habilita confirmação**

- **Rastreabilidade:** US-07 · AC-07.4 · RN-23
- **Tipo / prioridade:** negativo / alta · automatizável: sim
- **Pré-condições:** Autenticado; Carrinho com qualquer item; Endereço válido preenchido
- **Dados:** cartao: 4111 1111 1111 1112 · validade: 12/30 · cvv: 123 · nome: TESTE QA

**Passos**
1. Escolher Cartão de crédito
2. Preencher os dados do cartão

**Resultado esperado:** O botão "Confirmar pedido" permanece desabilitado.

### TC-CHK-005
**Parcelamento em 3x com centavos soma o total exato**

- **Rastreabilidade:** US-07 · AC-07.5 · RN-22
- **Tipo / prioridade:** funcional / alta · automatizável: sim
- **Pré-condições:** Autenticado como novo@shopqa.com; Carrinho somente com Bola de Futebol Oficial; Frete SP (total R$ 164,80)
- **Dados:** endereco: {"cep":"01310-100","rua":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","uf":"SP"} · cartao: 4111 1111 1111 1111 · validade: 12/30 · cvv: 123 · parcelas: 3

**Passos**
1. Preencher endereço e cartão
2. Selecionar 3 parcelas
3. Confirmar o pedido
4. Conferir a confirmação e "Meus pedidos"

**Resultado esperado:** Parcelas exibidas como 1x de R$ 54,94 + 2x de R$ 54,93 e o total cobrado é R$ 164,80 na confirmação e em "Meus pedidos".

### TC-CHK-006
**Estoque insuficiente na confirmação**

- **Rastreabilidade:** US-07 · AC-07.7 · RN-26
- **Tipo / prioridade:** funcional / alta · automatizável: não
- **Pré-condições:** Aba A: autenticado, carrinho com 3 "Tênis de Corrida Ágil" (estoque 3); Aba B: outro cliente compra 1 unidade do mesmo produto
- **Dados:** endereco: {"cep":"01310-100","rua":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","uf":"SP"} · pagamento: PIX

**Passos**
1. Na aba B, concluir a compra de 1 Tênis
2. Na aba A, confirmar o pedido

**Resultado esperado:** Na aba A exibe "Estoque insuficiente para \"Tênis de Corrida Ágil\". Disponível: 2." e nenhum pedido é criado.

### TC-CHK-007
**Duplo clique em Confirmar gera um único pedido**

- **Rastreabilidade:** US-07 · AC-07.6 · RN-25, RN-26
- **Tipo / prioridade:** funcional / critica · automatizável: sim
- **Pré-condições:** Autenticado como novo@shopqa.com; Carrinho com 1 Garrafa Térmica 1L; Endereço válido; PIX selecionado
- **Dados:** endereco: {"cep":"01310-100","rua":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","uf":"SP"} · pagamento: PIX

**Passos**
1. Dar duplo clique em "Confirmar pedido"
2. Acessar "Meus pedidos"

**Resultado esperado:** O botão fica desabilitado com "Processando pagamento..." após o 1º clique; "Meus pedidos" lista exatamente 1 novo pedido e o estoque da Garrafa diminui 1 unidade.

---

## US-08

### TC-PED-001
**Pedidos ordenados do mais recente**

- **Rastreabilidade:** US-08 · AC-08.1 · RN-30
- **Tipo / prioridade:** funcional / media · automatizável: sim
- **Pré-condições:** Autenticado como veterana@shopqa.com
- **Dados:** —

**Passos**
1. Acessar #/pedidos

**Resultado esperado:** Pedido #1003 (18/06/2026) aparece antes do #1002 (02/03/2026).

### TC-PED-002
**Cliente sem pedidos**

- **Rastreabilidade:** US-08 · AC-08.2 · RN-30
- **Tipo / prioridade:** funcional / baixa · automatizável: sim
- **Pré-condições:** Autenticado como novo@shopqa.com (sem pedidos)
- **Dados:** —

**Passos**
1. Acessar #/pedidos

**Resultado esperado:** Exibe "Você ainda não fez pedidos.".

### TC-PED-003
**Acesso a pedidos sem login**

- **Rastreabilidade:** US-08 · AC-08.4 · RN-24
- **Tipo / prioridade:** seguranca / media · automatizável: sim
- **Pré-condições:** Não autenticado
- **Dados:** —

**Passos**
1. Acessar #/pedidos diretamente pela URL

**Resultado esperado:** O cliente é redirecionado para #/login.
