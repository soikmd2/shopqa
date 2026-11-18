// Corretor automático do Desafio 3 — rode com: npm run desafios:corrigir
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { caminhoDoHook, rodar, projetoTemporario, RAIZ } from '../_comum/corretor.mjs';

const HOOK = caminhoDoHook('desafio-3-portao-relatorio-de-risco', 3);
const VALIDO = fs.readFileSync(path.join(RAIZ, 'desafios/desafio-3-portao-relatorio-de-risco/exemplo-valido.md'), 'utf8');

const criados = [];
after(() => criados.forEach((p) => p.remover()));

/** Cria uma pasta de riscos isolada com os relatórios informados e roda o hook de Stop. */
function pararCom(relatorios, stopHookActive = false) {
  const proj = projetoTemporario();
  criados.push(proj);
  for (const [nome, texto] of Object.entries(relatorios)) proj.escrever(`qa/riscos/${nome}`, texto);
  return rodar(HOOK, { hook_event_name: 'Stop', stop_hook_active: stopHookActive }, { CLAUDE_PROJECT_DIR: proj.dir, SHOPQA_RISCOS_DIR: '' });
}

test('3.1 sem relatórios, o Claude pode encerrar', () => {
  assert.equal(pararCom({}).exit, 0);
});

test('3.2 relatório completo e coerente libera o encerramento', () => {
  const r = pararCom({ 'RISCO-PR-101.md': VALIDO });
  assert.equal(r.exit, 0, r.stderr);
});

test('3.3 seção faltando bloqueia e diz qual', () => {
  const r = pararCom({ 'RISCO-PR-101.md': VALIDO.replace(/## 5\. Lacunas[\s\S]*?(?=## 6\.)/, '') });
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /RISCO-PR-101\.md/);
  assert.match(r.stderr, /5/);
});

test('3.4 matriz com menos de 3 riscos bloqueia', () => {
  const texto = VALIDO.split('\n').filter((l) => !/^\|\s*R[3-9]/.test(l)).join('\n');
  const r = pararCom({ 'RISCO-PR-102.md': texto });
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /matriz/i);
});

test('3.5 risco sem nível numérico bloqueia', () => {
  const texto = VALIDO.replace(/\| 9 \|\s*$/m, '| alto |');
  const r = pararCom({ 'RISCO-PR-101.md': texto });
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /n[íi]vel/i);
});

test('3.6 recomendação ausente bloqueia', () => {
  const texto = VALIDO.replace(/\*\*BLOQUEAR\.\*\*/, 'Precisamos conversar.');
  const r = pararCom({ 'RISCO-PR-101.md': texto });
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /recomenda/i);
});

test('3.7 "APROVAR" com risco ≥ 6 é incoerente e bloqueia', () => {
  const texto = VALIDO.replace(/\*\*BLOQUEAR\.\*\*/, '**APROVAR.**');
  const r = pararCom({ 'RISCO-PR-101.md': texto });
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /APROVAR/);
});

test('3.8 só arquivos RISCO-PR-<número>.md são avaliados', () => {
  const r = pararCom({ 'rascunho.md': 'qualquer coisa', 'MODELO-RISCO.md': '# modelo' });
  assert.equal(r.exit, 0);
});

test('3.9 anti-loop: com stop_hook_active=true NÃO bloqueia de novo, mas avisa via systemMessage', () => {
  const r = pararCom({ 'RISCO-PR-101.md': '# vazio' }, true);
  assert.equal(r.exit, 0, 'bloquear de novo pode prender o Claude num loop infinito');
  assert.ok(r.json && typeof r.json.systemMessage === 'string', 'esperado JSON com systemMessage no stdout');
});
