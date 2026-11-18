---
id: US-06
titulo: Cadastro e autenticação de clientes
epico: EP-04 Conta do cliente
prioridade: Must have
estimativa: 8 pontos
status: Done (Sprint 11)
regras: [RN-24, RN-27, RN-28, RN-29]
---

# US-06 — Cadastro e autenticação de clientes

## Narrativa
**Como** visitante
**Quero** criar uma conta e entrar na loja
**Para** finalizar compras e acompanhar meus pedidos

## Critérios de aceite

**AC-06.1 — Cadastro com sucesso**
```gherkin
Dado que preencho nome e sobrenome, e-mail válido, CPF válido, senha válida, confirmação igual e aceito os termos
Quando clico em "Criar conta"
Então minha conta é criada e já fico autenticado
```

**AC-06.2 — Validações de cadastro**
```gherkin
Quando deixo de atender alguma regra (nome sem sobrenome, e-mail inválido, CPF inválido, senha fraca, confirmação diferente, termos não aceitos)
Então vejo a mensagem de erro ao lado do campo correspondente
E a conta não é criada
```

**AC-06.3 — E-mail duplicado**
```gherkin
Dado que já existe conta com "cliente@shopqa.com"
Quando tento me cadastrar com o mesmo e-mail (em qualquer capitalização)
Então vejo "Já existe uma conta com este e-mail."
```

**AC-06.4 — Login**
```gherkin
Dado que tenho uma conta
Quando informo e-mail e senha corretos
Então sou autenticado e vejo "Olá, <primeiro nome>" no cabeçalho
```

**AC-06.5 — Bloqueio por tentativas**
```gherkin
Dado que errei a senha 4 vezes seguidas
Quando erro a senha pela 5ª vez
Então vejo "Conta bloqueada temporariamente por excesso de tentativas. Tente novamente em 15 minutos."
E mesmo informando a senha correta não consigo entrar durante 15 minutos
```

**AC-06.6 — Mensagem genérica**
```gherkin
Quando informo um e-mail não cadastrado ou uma senha errada
Então vejo a mesma mensagem: "E-mail ou senha inválidos."
```

## Restrições
- Senha com no mínimo 6 caracteres, contendo letras e números.
- Sessão persiste ao recarregar a página até o cliente clicar em "Sair".

## Fora de escopo
- Recuperação de senha, login social, 2FA.

## Requisitos não funcionais relacionados
- RNF-02 (segurança), RNF-04 (LGPD — dados pessoais).
