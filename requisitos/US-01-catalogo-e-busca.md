---
id: US-01
titulo: Catálogo de produtos com busca, filtro e ordenação
epico: EP-01 Descoberta de produtos
prioridade: Must have
estimativa: 5 pontos
status: Done (Sprint 12)
regras: [RN-01, RN-02, RN-03, RN-04, RN-10]
---

# US-01 — Catálogo de produtos com busca, filtro e ordenação

## Narrativa
**Como** visitante da loja
**Quero** buscar, filtrar e ordenar os produtos
**Para** encontrar rapidamente o que desejo comprar

## Contexto
O catálogo é a página inicial. Segundo o time de dados, 62% das sessões começam com uma busca, e buscas digitadas no celular costumam vir sem acentos e com capitalização aleatória (“fone”, “Cafeteira”, “LUMINARIA”).

## Critérios de aceite

**AC-01.1 — Busca por nome sem diferenciar maiúsculas e acentos**
```gherkin
Dado que estou no catálogo
Quando busco por "fone", "FONE" ou "Fône"
Então vejo o produto "Fone Bluetooth Pro"
```

**AC-01.2 — Busca sem resultados**
```gherkin
Dado que estou no catálogo
Quando busco por um termo inexistente como "geladeira"
Então vejo a mensagem "Nenhum produto encontrado para “geladeira”."
E o contador exibe "0 itens encontrados"
```

**AC-01.3 — Filtro por categoria**
```gherkin
Dado que estou no catálogo
Quando seleciono a categoria "Livros"
Então vejo apenas produtos da categoria "Livros"
E o filtro pode ser combinado com a busca
```

**AC-01.4 — Ordenação**
```gherkin
Dado que estou no catálogo
Quando escolho "Menor preço"
Então os produtos são exibidos do menor para o maior preço
E a ordenação padrão, ao abrir a página, é "Mais vendidos"
```

**AC-01.5 — Contador de resultados**
```gherkin
Dado que estou no catálogo
Então o contador respeita a concordância de número (RN-03)
```

**AC-01.6 — Disponibilidade**
```gherkin
Dado um produto com estoque 0
Então o card exibe "Esgotado" e o botão "Adicionar ao carrinho" fica desabilitado
Dado um produto com estoque entre 1 e 5
Então o card exibe "Últimas N unidades"
```

## Restrições
- Sem paginação nesta versão (catálogo < 50 itens).
- A busca roda no front-end; não há chamada ao servidor por tecla digitada.

## Fora de escopo
- Busca por descrição ou categoria.
- Sugestões / autocompletar.

## Requisitos não funcionais relacionados
- RNF-01 (desempenho), RNF-03 (acessibilidade).

## Dados de teste sugeridos
- “Fone Bluetooth Pro” (estoque 25), “Livro: Inteligência Artificial para Iniciantes” (estoque 0), “Tênis de Corrida Ágil” (estoque 3).

## Definition of Done
- [x] Critérios de aceite validados pelo QA
- [x] Testes unitários das funções de busca/ordenação
- [x] Revisão de acessibilidade básica (labels nos campos)
