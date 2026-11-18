#!/usr/bin/env node
// EXEMPLO 5 — PostToolUse (matcher: *)
// Guardrail de OBSERVABILIDADE: registra toda ação do agente numa trilha de auditoria (JSON Lines).
// Não bloqueia nada — e nunca deve: política "fail-open" (exit 0 mesmo em erro).
// Útil para responder "o que a IA fez nesta sessão?" e para evidências de teste.

import fs from 'node:fs';
import path from 'node:path';
import { lerEntrada, raizDoProjeto } from './lib/entrada.js';

try {
  const e = lerEntrada();
  const raiz = raizDoProjeto(e);
  const ti = e.tool_input || {};
  const alvo = ti.command || ti.file_path || ti.notebook_path || ti.pattern || ti.url || ti.query || '';

  const registro = {
    quando: new Date().toISOString(),
    sessao: e.session_id,
    ferramenta: e.tool_name,
    alvo: String(alvo).slice(0, 200)
  };

  const pasta = path.join(raiz, '.claude', 'logs');
  fs.mkdirSync(pasta, { recursive: true });
  fs.appendFileSync(path.join(pasta, 'auditoria.jsonl'), JSON.stringify(registro) + '\n');
} catch {
  // silencioso de propósito
}
process.exit(0);
