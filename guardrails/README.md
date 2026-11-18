# Guardrails com hooks do Claude Code

> **Prompt pede. Guardrail garante.**
> Um prompt bem escrito *aumenta a chance* de a IA fazer a coisa certa. Um hook é código determinístico que roda **sempre**, no momento exato, e pode **bloquear, corrigir ou complementar** a ação da IA — mesmo que ninguém lembre de pedir.

## Onde os hooks entram no ciclo do agente

```
 pessoa digita ──► [UserPromptSubmit] ──► modelo pensa ──► quer usar ferramenta
                        E4, Desafio 1                              │
                                                                   ▼
                                                           [PreToolUse]  E1, E2
                                                                   │  (pode impedir)
                                                                   ▼
                                                       ferramenta executa (Bash, Write…)
                                                                   │
                                                                   ▼
                                                           [PostToolUse] E3, E5, Desafio 2
                                                                   │  (pode devolver p/ correção)
                                                                   ▼
                                               modelo acha que terminou ──► [Stop] E6, Desafio 3
                                                                                (pode mandar continuar)
```

## O contrato de um hook

**Entrada (stdin):** um JSON. Campos comuns: `session_id`, `cwd`, `hook_event_name`. Por evento:
`tool_name` e `tool_input` (Pre/PostToolUse), `tool_response` (PostToolUse), `prompt` (UserPromptSubmit), `stop_hook_active` (Stop).

**Saída:**

| Exit code | Significado | Efeito por evento |
|-----------|-------------|-------------------|
| `0` | segue | stdout vira **contexto** só em `UserPromptSubmit`/`SessionStart`; JSON no stdout permite controle fino |
| `2` | **bloqueia** | PreToolUse: cancela a ferramenta · PostToolUse: devolve o stderr ao Claude · UserPromptSubmit: descarta o prompt · Stop: obriga a continuar |
| outro | erro não bloqueante | a ação segue; o erro aparece no transcript |

**JSON útil (exit 0):**
```json
{ "hookSpecificOutput": { "hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "..." } }
{ "systemMessage": "aviso exibido à pessoa usuária" }
```
`permissionDecision`: `allow` (pula a confirmação) · `deny` (bloqueia) · `ask` (pergunta à pessoa).

## Os exemplos

| # | Arquivo | Evento | O que ensina | Política em caso de erro |
|---|---------|--------|--------------|--------------------------|
| E1 | `e1-bloquear-comandos-perigosos.js` | PreToolUse · `Bash` | Lista de bloqueio com **alternativa segura** na mensagem; cuidado com falso positivo (`.env.example`) | fail-closed |
| E2 | `e2-proteger-arquivos.js` | PreToolUse · `Write\|Edit` | Proteger o **oráculo** (requisitos) e o sistema sob teste; decisões `deny`/`ask` via JSON; modo QA × dev | fail-closed |
| E3 | `e3-validar-casos-de-teste.js` | PostToolUse · `Write\|Edit` | Validar a **saída** da IA (schema + frases vagas) e criar o ciclo gera → valida → corrige | fail-open |
| E4 | `e4-proteger-prompt.js` | UserPromptSubmit | **LGPD**: barrar CPF/cartão reais antes de chegarem ao modelo; injetar lembretes | fail-closed |
| E5 | `e5-auditoria.js` | PostToolUse · `*` | Observabilidade: trilha de tudo que a IA fez (`.claude/logs/auditoria.jsonl`) | fail-open (silencioso) |
| E6 | `e6-portao-de-qualidade.js` | Stop | Não deixar “terminar” com testes quebrados; **anti-loop** | fail-open |

**Fail-closed × fail-open:** se o próprio hook quebrar, ele bloqueia (segurança/privacidade) ou libera (qualidade/observabilidade)? Decida conscientemente.

## Comandos

```bash
npm run hooks:testar                     # roda todas as fixtures (exemplos/fixtures/*.json) e confere o esperado
npm run hooks:testar -- e2-editar        # uma fixture, em modo detalhado (stdin, exit, stdout, stderr)
npm run guardrails:instalar              # gera .claude/settings.json com E1–E6
npm run guardrails:instalar -- --desafios
npm run guardrails:instalar -- --remover
```

No Claude Code, `/hooks` mostra o que está ativo. `SHOPQA_MODO=dev claude` libera (com confirmação) a edição de `src/` e liga o portão E6.

## Boas práticas
1. **Mensagem de bloqueio = instrução.** Diga o motivo e a alternativa; o Claude lê o stderr e muda de estratégia.
2. **Determinístico e rápido.** Hooks rodam a cada ação; nada de chamadas de rede lentas.
3. **Teste o hook como código** (fixtures + corretor). Hook com bug é pior que hook nenhum.
4. **Hooks não substituem permissões nem revisão humana.** São uma camada a mais.
5. **Os hooks se protegem**: E2 impede a IA de editar `guardrails/` e `.claude/settings.json`.
6. Hooks executam com as suas permissões de usuário — revise qualquer hook antes de instalá-lo.
