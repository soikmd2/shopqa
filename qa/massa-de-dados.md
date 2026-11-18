# Massa de dados fictícia — ShopQA

> **Todos os dados abaixo são fictícios** e podem ser usados livremente em testes e em prompts de IA.
> Dados reais de clientes **nunca** (RNF-04 / LGPD). O guardrail `E4` bloqueia prompts com CPF ou cartão reais.
> Para voltar ao estado inicial: rodapé da loja → **“Restaurar dados de demonstração”**.

## Contas

| E-mail | Senha | Nome | CPF | Pedidos anteriores | Uso típico |
|--------|-------|------|-----|--------------------|-----------|
| cliente@shopqa.com | Senha123 | Ana Cliente | 529.982.247-25 | 1 (#1001) | Cliente recorrente |
| novo@shopqa.com | Senha123 | Bruno Novo | 111.444.777-35 | 0 | Primeira compra |
| veterana@shopqa.com | Senha123 | Carla Veterana | 390.533.447-05 | 2 (#1002, #1003) | Histórico de pedidos |
| bloqueio@shopqa.com | Senha123 | Diego Bloqueio | 286.255.878-87 | 0 | Bloqueio por tentativas |

CPF válido livre para cadastro: **935.411.347-80**.

## Cartões (ambiente de teste)

| Número | Situação |
|--------|----------|
| 4111 1111 1111 1111 | Válido (Luhn) |
| 5555 5555 5555 4444 | Válido (Luhn) |
| 4000 0000 0000 0002 | Válido (Luhn) |
| 4111 1111 1111 1112 | Inválido (Luhn) |

Validade de exemplo `12/30` · CVV `123` · Nome `TESTE QA`.

## CEPs

| CEP | Região (RN-18) | Frete | Prazo |
|-----|----------------|-------|-------|
| 01310-100 | SP | R$ 14,90 | 2 dias |
| 20040-020 | RJ / ES / MG | R$ 19,90 | 3 dias |
| 40010-000 | Nordeste / Norte | R$ 29,90 | 6 dias |
| 70040-010 | Centro-Oeste / DF | R$ 24,90 | 5 dias |
| 90010-000 | Sul | R$ 22,90 | 4 dias |

## Produtos úteis para valores-limite

| ID | Produto | Preço | Estoque | Para testar |
|----|---------|-------|---------|-------------|
| 1 | Fone Bluetooth Pro | R$ 299,00 | 25 | Limite do frete grátis (RN-19) |
| 4 | Mouse Óptico Sem Fio | R$ 89,90 | 60 | Limite de 10 unidades (RN-08) |
| 9 | Bola de Futebol Oficial | R$ 149,90 | 40 | PIX e parcelamento com centavos |
| 10 | Tênis de Corrida Ágil | R$ 399,90 | 3 | Estoque baixo / concorrência |
| 13 | Livro: IA para Iniciantes | R$ 74,50 | 0 | Produto esgotado |
| 14 | Cadeira Ergonômica Office | R$ 1.299,90 | 6 | Formatação com milhar |

## Cupons

Ver “Cupons vigentes” em `requisitos/regras-de-negocio.md`.
