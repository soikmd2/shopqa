#!/usr/bin/env node
// EXEMPLO 6 — Stop (sem matcher)
// "Portão de qualidade": quando o Claude acha que terminou, roda a suíte de regressão.
// Se houver falha, devolve exit 2 → o Claude NÃO encerra e recebe a saída dos testes como
// próxima instrução ("corrija antes de dizer que acabou").
//
// Cuidado com LOOP INFINITO: se os testes nunca passarem, o Claude nunca para.
// O Claude Code envia "stop_hook_active": true quando a parada atual já foi provocada
// por um Stop hook. Aqui permitimos no máximo 3 voltas e depois liberamos com um aviso.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lerEntrada, raizDoProjeto, bloquear, permitir, responderJson } from './lib/entrada.js';

const MAX_VOLTAS = 3;

try {
  const entrada = lerEntrada();
  const raiz = raizDoProjeto(entrada);

  // Só faz sentido quando a IA pode mexer no código (modo dev).
  if (process.env.SHOPQA_MODO !== 'dev') permitir();

  const contador = path.join(os.tmpdir(), `shopqa-stop-${entrada.session_id || 'local'}.txt`);
  const voltas = entrada.stop_hook_active && fs.existsSync(contador) ? Number(fs.readFileSync(contador, 'utf8')) : 0;

  const r = spawnSync(process.execPath, ['--test', 'tests/regras/**/*.test.js'], { cwd: raiz, encoding: 'utf8' });
  if (r.status === 0) {
    fs.rmSync(contador, { force: true });
    permitir();
  }

  if (voltas >= MAX_VOLTAS) {
    fs.rmSync(contador, { force: true });
    responderJson({ systemMessage: `⚠️ Portão de qualidade: testes ainda falhando após ${MAX_VOLTAS} tentativas. Revisão humana necessária.` });
  }

  fs.writeFileSync(contador, String(voltas + 1));
  const falhas = (r.stdout + r.stderr).split('\n').filter((l) => /^not ok|AssertionError|expected|actual/.test(l.trim())).slice(0, 25).join('\n');
  bloquear(
    `🚧 GUARDRAIL E6 — você ainda não terminou: a suíte de regressão está falhando (tentativa ${voltas + 1}/${MAX_VOLTAS}).\n` +
    `${falhas}\n` +
    'Corrija o código (não os testes nem os requisitos) e rode "npm run test:regras" antes de encerrar.'
  );
} catch (erro) {
  // Portão de qualidade é fail-open: um erro interno não pode prender o agente.
  process.stderr.write(`Aviso E6: portão não executado (${erro.message}).\n`);
  process.exit(1);
}
