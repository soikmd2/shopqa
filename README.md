# 🛒 ShopQA — loja virtual de laboratório do curso **IA para QAs**

ShopQA é um e-commerce em React feito para ser **testado**. Ele tem catálogo, avaliações, carrinho, cupons, frete por CEP, cadastro/login com bloqueio, checkout com PIX e cartão parcelado, e histórico de pedidos — com regras de negócio realistas e **defeitos que você vai precisar encontrar**.

> ⚠️ Esta versão (v1.4) contém **bugs intencionais** de diferentes complexidades e severidades. Não há lista deles aqui. Encontrá-los é o trabalho.

## Começando

```bash
nvm use                # usa o Node do .nvmrc (24 LTS); com fnm: fnm use
npm ci                 # instala exatamente as versões do package-lock.json
npm run dev            # abre http://localhost:5173 (Ctrl+C para parar)
```

O `npm run dev` ocupa o terminal enquanto a loja estiver no ar. Para deixá-la rodando em segundo plano e continuar usando o mesmo terminal:

```bash
npm run dev:bg         # sobe a loja e libera o terminal (log em .shopqa-dev.log)
npm run dev:stop       # derruba a loja
```

Requer **Node.js 22 ou superior** (recomendado: 24 LTS, indicado no `.nvmrc`). Com versão mais antiga, a instalação falha de propósito (`engine-strict` no `.npmrc`) — atualize o Node e tente de novo.

Os dados ficam no `localStorage` do navegador. Para voltar ao estado inicial: rodapé da loja → **“Restaurar dados de demonstração”**.
Contas, cartões e CEPs de teste: [`qa/massa-de-dados.md`](qa/massa-de-dados.md).

## O que tem no projeto

| Pasta | Para quê |
|-------|----------|
| `src/` | A aplicação (React + Vite). `src/domain/` concentra as regras de negócio em funções puras. |
| `requisitos/` | User stories US-01…US-08 (Gherkin), regras de negócio RN-01…RN-30, requisitos não funcionais e glossário. **Podem conter lacunas e contradições.** |
| `qa/` | Casos de teste (`.json` = fonte de verdade, `.md`/`.csv` = leitura), massa de dados, modelo de bug report e de relatório de risco. |
| `tests/regras/` | Suíte de regressão automatizada da camada de domínio (`node:test`). |
| `prompts/` | Prompts prontos: análise de requisitos, geração de casos de teste, risco por mudança de código, bug report. |
| `mudancas/` | 3 pull requests simulados (descrição + diff aplicável + história nova) para análise de risco. |
| `guardrails/` | Hooks do Claude Code: 6 exemplos comentados, simulador e instalador. |
| `desafios/` | 3 desafios práticos de hooks com corretor automático. |

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe a loja no terminal atual (Ctrl+C para parar) |
| `npm run dev:bg` | Sobe a loja em segundo plano e libera o terminal |
| `npm run dev:stop` | Derruba a loja iniciada com `dev:bg` |
| `npm run test:regras` | Suíte de regressão (36 testes) |
| `npm run casos:exportar` | Regera `casos-de-teste.md` e `.csv` a partir do JSON |
| `npm run hooks:testar` | Simula todos os hooks de exemplo com as fixtures e mostra um resumo (total, por hook, por resultado) |
| `npm run guardrails:instalar` | Gera `.claude/settings.json` com os hooks (`-- --desafios` inclui os desafios) |
| `npm run desafios:corrigir` | Corretor automático dos desafios |
| `npm run aula:resetar` | Mostra o que voltaria ao estado inicial da aula; `-- --confirmar` desfaz (alterações nas pastas do curso, arquivos novos, trilha do E5, loja em segundo plano) e `-- --sem-guardrails` também remove o `.claude/settings.json` |

## Trabalhando com o Claude Code

```bash
npm run guardrails:instalar     # liga os guardrails
claude                          # modo QA: a IA lê tudo, mas não altera requisitos nem src/
SHOPQA_MODO=dev claude          # modo dev: edição de src/ com confirmação + portão de testes no final
```

## Mapa da aplicação

| Rota | Tela |
|------|------|
| `#/` | Catálogo (busca, categoria, ordenação) |
| `#/produto/:id` | Detalhe + avaliações |
| `#/carrinho` | Carrinho, cupom e frete |
| `#/checkout` | Endereço e pagamento (exige login) |
| `#/login`, `#/cadastro` | Conta |
| `#/pedidos`, `#/pedido/:id` | Histórico e confirmação |

Todos os elementos interativos têm `data-testid` para automação.
