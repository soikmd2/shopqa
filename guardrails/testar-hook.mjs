#!/usr/bin/env node
// Simulador de hooks: executa um hook exatamente como o Claude Code faria
// (JSON no stdin, variáveis de ambiente, leitura do exit code / stdout / stderr),
// sem precisar abrir o Claude Code. Ótimo para desenvolver e depurar hooks.
//
//   npm run hooks:testar                                   → roda TODAS as fixtures e confere o esperado
//   npm run hooks:testar -- e1-rm-rf                       → roda uma fixture, em modo detalhado
//   npm run hooks:testar -- guardrails/hooks/e1-bloquear-comandos-perigosos.js '{"tool_input":{"command":"ls"}}'
//                                                          → roda um hook qualquer com um JSON qualquer

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pastaFixtures = path.join(raiz, 'guardrails', 'exemplos', 'fixtures');

export function executarHook(arquivoHook, entrada, env = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'shopqa-hook-'));
  const resolverEnv = Object.fromEntries(Object.entries(env).map(([k, v]) => [k, v === '__TMP__' ? tmp : v]));
  const r = spawnSync(process.execPath, [path.resolve(raiz, arquivoHook)], {
    input: JSON.stringify({ session_id: 'teste-local', cwd: raiz, ...entrada }),
    encoding: 'utf8',
    cwd: raiz,
    env: { ...process.env, CLAUDE_PROJECT_DIR: raiz, SHOPQA_MODO: '', ...resolverEnv },
    timeout: 60000
  });
  fs.rmSync(tmp, { recursive: true, force: true });
  let json = null;
  try { json = r.stdout.trim().startsWith('{') ? JSON.parse(r.stdout) : null; } catch { /* texto */ }
  return { exit: r.status, stdout: r.stdout.trim(), stderr: r.stderr.trim(), json };
}

export function interpretar(evento, r) {
  const decisao = r.json?.hookSpecificOutput?.permissionDecision || r.json?.decision;
  if (r.exit === 2) {
    return {
      PreToolUse: '🛑 ferramenta BLOQUEADA — o stderr é enviado ao Claude',
      PostToolUse: '🔁 ferramenta já executou — o stderr é enviado ao Claude para correção',
      UserPromptSubmit: '🔒 prompt DESCARTADO — o stderr é mostrado à pessoa usuária',
      Stop: '🚧 o Claude NÃO pode encerrar — o stderr vira a próxima instrução'
    }[evento] || '🛑 bloqueado (exit 2)';
  }
  if (r.exit === 0 && decisao) return `📋 decisão via JSON: ${decisao}`;
  if (r.exit === 0 && r.stdout && ['UserPromptSubmit', 'SessionStart'].includes(evento)) return '➕ permitido + stdout injetado como contexto para o Claude';
  if (r.exit === 0) return '✅ permitido';
  return `⚠️ erro não bloqueante (exit ${r.exit}) — a ação segue`;
}

function carregarFixtures() {
  return fs.readdirSync(pastaFixtures)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ nome: f.replace(/\.json$/, ''), ...JSON.parse(fs.readFileSync(path.join(pastaFixtures, f), 'utf8')) }));
}

function confere(fx, r) {
  const e = fx.esperado || {};
  const problemas = [];
  if (e.exit !== undefined && r.exit !== e.exit) problemas.push(`exit ${r.exit} ≠ ${e.exit}`);
  if (e.decisao && r.json?.hookSpecificOutput?.permissionDecision !== e.decisao) problemas.push(`decisão ${r.json?.hookSpecificOutput?.permissionDecision} ≠ ${e.decisao}`);
  if (e.stdoutContem && !r.stdout.includes(e.stdoutContem)) problemas.push(`stdout sem "${e.stdoutContem}"`);
  if (e.stderrContem && !r.stderr.includes(e.stderrContem)) problemas.push(`stderr sem "${e.stderrContem}"`);
  if (e.stdoutVazio && r.stdout) problemas.push('stdout deveria estar vazio');
  return problemas;
}

function detalhar(fx, r) {
  console.log(`\n▶ ${fx.nome} — ${fx.descricao}`);
  console.log(`  hook:     ${fx.hook}`);
  console.log(`  evento:   ${fx.entrada.hook_event_name}`);
  console.log(`  stdin:    ${JSON.stringify(fx.entrada)}`);
  console.log(`  exit:     ${r.exit}`);
  if (r.stdout) console.log(`  stdout:   ${r.stdout.replace(/\n/g, '\n            ')}`);
  if (r.stderr) console.log(`  stderr:   ${r.stderr.replace(/\n/g, '\n            ')}`);
  console.log(`  ⇒ ${interpretar(fx.entrada.hook_event_name, r)}`);
}

// ---------- CLI ----------
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [alvo, jsonManual] = process.argv.slice(2);
  if (alvo && jsonManual) {
    const entrada = JSON.parse(jsonManual);
    const r = executarHook(alvo, entrada);
    detalhar({ nome: 'manual', descricao: 'execução manual', hook: alvo, entrada }, r);
  } else if (alvo) {
    const fx = carregarFixtures().find((f) => f.nome === alvo || f.nome.startsWith(alvo));
    if (!fx) { console.error(`Fixture "${alvo}" não encontrada em guardrails/exemplos/fixtures/`); process.exit(1); }
    detalhar(fx, executarHook(fx.hook, fx.entrada, fx.env));
  } else {
    let falhas = 0;
    console.log('Fixtures dos guardrails (guardrails/exemplos/fixtures):\n');
    for (const fx of carregarFixtures()) {
      const r = executarHook(fx.hook, fx.entrada, fx.env);
      const problemas = confere(fx, r);
      falhas += problemas.length ? 1 : 0;
      console.log(`${problemas.length ? '❌' : '✅'} ${fx.nome.padEnd(34)} ${interpretar(fx.entrada.hook_event_name, r)}${problemas.length ? `  ← ${problemas.join('; ')}` : ''}`);
    }
    console.log(falhas ? `\n${falhas} fixture(s) com resultado inesperado.` : '\nTodos os guardrails se comportaram como esperado.');
    process.exit(falhas ? 1 : 0);
  }
}
