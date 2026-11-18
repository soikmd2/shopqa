// Corretor automático do Desafio 2 — rode com: npm run desafios:corrigir
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { caminhoDoHook, rodar, projetoTemporario, RAIZ } from '../_comum/corretor.mjs';

const HOOK = caminhoDoHook('desafio-2-rastreabilidade', 2);
const proj = projetoTemporario();
after(() => proj.remover());

const caso = (extra) => ({
  id: 'TC-CUP-101', titulo: 'Caso de teste de exemplo do corretor', historia: 'US-04', criterio: 'AC-04.5',
  regras: ['RN-14'], tipo: 'funcional', prioridade: 'alta', precondicoes: [], dados: {},
  passos: ['Aplicar BLACK50', 'Remover o item'], resultadoEsperado: 'O cupom é removido e um aviso é exibido.', automatizavel: true,
  ...extra
});
const escritaDe = (relativo, casos) => {
  const alvo = proj.escrever(relativo, { projeto: 'ShopQA v1.4', versaoSchema: '1.0', casos });
  return { hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: alvo }, tool_response: { success: true } };
};
const env = { CLAUDE_PROJECT_DIR: proj.dir };

test('2.1 casos com referências válidas passam', () => {
  const r = rodar(HOOK, escritaDe('qa/casos-de-teste/validos.json', [caso()]), env);
  assert.equal(r.exit, 0, `não deveria bloquear. stderr: ${r.stderr}`);
});

test('2.2 os 50 casos oficiais passam', () => {
  const oficiais = JSON.parse(fs.readFileSync(path.join(RAIZ, 'qa/casos-de-teste/casos-de-teste.json'), 'utf8')).casos;
  const r = rodar(HOOK, escritaDe('qa/casos-de-teste/oficiais.json', oficiais), env);
  assert.equal(r.exit, 0, r.stderr);
});

test('2.3 regra inventada (RN-99) bloqueia citando o caso e a regra', () => {
  const r = rodar(HOOK, escritaDe('qa/casos-de-teste/rn.json', [caso({ regras: ['RN-14', 'RN-99'] })]), env);
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /TC-CUP-101/);
  assert.match(r.stderr, /RN-99/);
});

test('2.4 critério inexistente na história (AC-04.9) bloqueia', () => {
  const r = rodar(HOOK, escritaDe('qa/casos-de-teste/ac.json', [caso({ criterio: 'AC-04.9' })]), env);
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /AC-04\.9/);
});

test('2.5 história inexistente (US-42) bloqueia', () => {
  const r = rodar(HOOK, escritaDe('qa/casos-de-teste/us.json', [caso({ historia: 'US-42', criterio: 'AC-42.1' })]), env);
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /US-42/);
});

test('2.6 lista TODOS os problemas de uma vez (não para no primeiro)', () => {
  const r = rodar(HOOK, escritaDe('qa/casos-de-teste/varios.json', [
    caso({ id: 'TC-CUP-201', regras: ['RN-98'] }),
    caso({ id: 'TC-CUP-202', criterio: 'AC-04.8' })
  ]), env);
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /TC-CUP-201/);
  assert.match(r.stderr, /TC-CUP-202/);
});

test('2.7 arquivos fora de qa/casos-de-teste/ são ignorados', () => {
  const alvo = proj.escrever('qa/bugs/BUG-001.md', '# bug com RN-99');
  const r = rodar(HOOK, { hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: alvo } }, env);
  assert.equal(r.exit, 0);
});

test('2.8 JSON inválido bloqueia com mensagem clara', () => {
  const alvo = proj.escrever('qa/casos-de-teste/quebrado.json', '{ "casos": [ ');
  const r = rodar(HOOK, { hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: alvo } }, env);
  assert.equal(r.exit, 2);
  assert.match(r.stderr, /JSON/i);
});
