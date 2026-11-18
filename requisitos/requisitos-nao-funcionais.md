# Requisitos Não Funcionais — ShopQA v1.4

| ID | Categoria | Requisito | Como verificar |
|----|-----------|-----------|----------------|
| RNF-01 | Desempenho | As páginas devem carregar rápido. | — |
| RNF-02 | Segurança | A aplicação deve estar protegida contra as vulnerabilidades do OWASP Top 10, em especial injeção e XSS. Nenhum conteúdo enviado por usuário pode ser interpretado como HTML/JS. | Revisão de código + testes com payloads de XSS |
| RNF-03 | Acessibilidade | Campos de formulário com rótulo; navegação por teclado nos fluxos de compra; contraste mínimo WCAG 2.1 AA. | Lighthouse ≥ 90 em Acessibilidade |
| RNF-04 | Privacidade (LGPD) | CPF e e-mail só podem aparecer para o próprio titular. Dados reais de clientes **nunca** podem ser usados em ambientes de teste, prompts de IA ou massa de dados. | Revisão de massa de dados; guardrails de IA |
| RNF-05 | Resiliência | Ações financeiras (confirmar pedido) devem ser idempotentes: repetições de clique ou de requisição não podem gerar efeitos duplicados. | Teste de duplo clique / reenvio |
| RNF-06 | Compatibilidade | Últimas 2 versões de Chrome, Firefox, Edge e Safari; layout responsivo a partir de 360 px de largura. | Testes cross-browser |
| RNF-07 | Observabilidade | Erros de checkout devem ser registrados com o identificador do carrinho. | — |
