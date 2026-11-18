#!/usr/bin/env node
// Instala os guardrails no Claude Code deste projeto, gerando .claude/settings.json.
//
//   npm run guardrails:instalar                 → exemplos E1–E6
//   npm run guardrails:instalar -- --desafios   → exemplos + hooks dos desafios 1–3
//   npm run guardrails:instalar -- --remover    → remove os hooks (mantém backup)
//
// Depois de instalar, abra o Claude Code na raiz do projeto e digite /hooks para conferir.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destinoDir = path.join(raiz, '.claude');
const destino = path.join(destinoDir, 'settings.json');
const args = new Set(process.argv.slice(2));

const cmd = (arquivo, timeout = 10) => ({ type: 'command', command: `node "\${CLAUDE_PROJECT_DIR}/${arquivo}"`, timeout });

fs.mkdirSync(destinoDir, { recursive: true });
let atual = {};
if (fs.existsSync(destino)) {
  atual = JSON.parse(fs.readFileSync(destino, 'utf8'));
  const backup = `${destino}.backup-${Date.now()}`;
  fs.copyFileSync(destino, backup);
  console.log(`↺ backup do settings anterior: ${path.relative(raiz, backup)}`);
}

if (args.has('--remover')) {
  delete atual.hooks;
  fs.writeFileSync(destino, JSON.stringify(atual, null, 2) + '\n');
  console.log('✔ hooks removidos de .claude/settings.json');
  process.exit(0);
}

const exemplo = JSON.parse(fs.readFileSync(path.join(raiz, 'guardrails', 'settings.exemplo.json'), 'utf8'));
const hooks = exemplo.hooks;

if (args.has('--desafios')) {
  hooks.UserPromptSubmit.push({ hooks: [cmd('desafios/desafio-1-contexto-automatico/hook.mjs')] });
  hooks.PostToolUse.push({ matcher: 'Write|Edit', hooks: [cmd('desafios/desafio-2-rastreabilidade/hook.mjs', 20)] });
  hooks.Stop.push({ hooks: [cmd('desafios/desafio-3-portao-relatorio-de-risco/hook.mjs', 30)] });
}

fs.writeFileSync(destino, JSON.stringify({ ...atual, hooks }, null, 2) + '\n');

const resumo = Object.entries(hooks).map(([evento, grupos]) =>
  `  ${evento.padEnd(17)} ${grupos.map((g) => `${g.matcher ? `[${g.matcher}] ` : ''}${g.hooks.map((h) => path.basename(h.command.replace(/"$/, ''))).join(', ')}`).join(' · ')}`
).join('\n');
console.log(`✔ .claude/settings.json gerado:\n${resumo}\n\nAbra o Claude Code nesta pasta e rode /hooks para conferir.`);
