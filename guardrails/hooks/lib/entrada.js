// Utilitários compartilhados pelos hooks da ShopQA.
// Todo hook do Claude Code recebe pelo stdin um JSON descrevendo o evento, por exemplo:
//   { "session_id": "...", "cwd": "...", "hook_event_name": "PreToolUse",
//     "tool_name": "Bash", "tool_input": { "command": "rm -rf src" } }
// e responde de duas formas possíveis:
//   1) CÓDIGO DE SAÍDA  — 0 = segue; 2 = bloqueia (stderr vira explicação); outro = erro não bloqueante.
//   2) JSON NO STDOUT   — controle fino (ex.: permissionDecision "deny" | "ask" | "allow").

import fs from 'node:fs';
import path from 'node:path';

/** Lê e faz o parse do JSON enviado pelo Claude Code via stdin. */
export function lerEntrada() {
  const bruto = fs.readFileSync(0, 'utf8');
  return bruto.trim() ? JSON.parse(bruto) : {};
}

/** Raiz do projeto: o Claude Code exporta CLAUDE_PROJECT_DIR para os hooks. */
export function raizDoProjeto(entrada = {}) {
  return process.env.CLAUDE_PROJECT_DIR || entrada.cwd || process.cwd();
}

/** Caminho relativo à raiz, sempre com "/" (funciona igual no Windows). */
export function caminhoRelativo(arquivo, raiz) {
  return path.relative(raiz, path.resolve(raiz, arquivo)).split(path.sep).join('/');
}

/**
 * Bloqueia via exit code 2. O que o Claude Code faz com o stderr depende do evento:
 *  - PreToolUse:       cancela a ferramenta e mostra o motivo ao Claude (ele tenta outro caminho);
 *  - PostToolUse:      a ferramenta JÁ rodou; o motivo vai ao Claude para ele corrigir;
 *  - UserPromptSubmit: descarta o prompt antes de chegar ao modelo e mostra o motivo à pessoa;
 *  - Stop:             impede o Claude de encerrar; o motivo vira a próxima instrução.
 */
export function bloquear(mensagem) {
  process.stderr.write(mensagem.trim() + '\n');
  process.exit(2);
}

/**
 * Permite a ação. Texto no stdout só vira CONTEXTO para o Claude em
 * UserPromptSubmit e SessionStart; nos demais eventos vai apenas para o log de debug.
 */
export function permitir(contextoExtra) {
  if (contextoExtra) process.stdout.write(contextoExtra.trim() + '\n');
  process.exit(0);
}

/** Responde com JSON estruturado (exit 0). Usado para "ask"/"deny" com motivo em PreToolUse. */
export function responderJson(objeto) {
  process.stdout.write(JSON.stringify(objeto) + '\n');
  process.exit(0);
}

/** Decisão de permissão em PreToolUse: 'allow' | 'deny' | 'ask'. */
export function decisaoPreToolUse(decisao, motivo) {
  responderJson({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decisao,
      permissionDecisionReason: motivo
    }
  });
}

/** Texto que a ferramenta pretende escrever (Write, Edit e o antigo MultiEdit). */
export function textoEscrito(toolInput = {}) {
  if (typeof toolInput.content === 'string') return toolInput.content;
  if (typeof toolInput.new_string === 'string') return toolInput.new_string;
  if (Array.isArray(toolInput.edits)) return toolInput.edits.map((e) => e.new_string || '').join('\n');
  return '';
}
