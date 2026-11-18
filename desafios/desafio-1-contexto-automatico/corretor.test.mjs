// Corretor automático do Desafio 1 — rode com: npm run desafios:corrigir
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caminhoDoHook, rodar } from '../_comum/corretor.mjs';

const HOOK = caminhoDoHook('desafio-1-contexto-automatico', 1);
const prompt = (texto) => ({ hook_event_name: 'UserPromptSubmit', prompt: texto });

test('1.1 injeta título, regras e arquivo da história citada', () => {
  const r = rodar(HOOK, prompt('Gere casos de teste para a US-04, por favor'));
  assert.equal(r.exit, 0, `exit deveria ser 0. stderr: ${r.stderr}`);
  assert.match(r.stdout, /US-04/);
  assert.match(r.stdout, /Cupons de desconto/);
  assert.match(r.stdout, /RN-15/);
  assert.match(r.stdout, /requisitos\/US-04-cupons\.md/);
});

test('1.2 várias histórias no mesmo prompt', () => {
  const r = rodar(HOOK, prompt('Compare a US-03 com a US-07'));
  assert.equal(r.exit, 0);
  assert.match(r.stdout, /Carrinho/i);
  assert.match(r.stdout, /Checkout e pagamento/);
});

test('1.3 reconhece o código em minúsculas (us-05)', () => {
  const r = rodar(HOOK, prompt('analise a us-05'));
  assert.equal(r.exit, 0);
  assert.match(r.stdout, /Frete/i);
});

test('1.4 bloqueia história inexistente e lista as disponíveis', () => {
  const r = rodar(HOOK, prompt('Gere casos para a US-99'));
  assert.equal(r.exit, 2, 'história inexistente deve bloquear o prompt (exit 2)');
  assert.match(r.stderr, /US-99/);
  assert.match(r.stderr, /US-01/);
  assert.match(r.stderr, /US-08/);
});

test('1.5 prompt sem história passa sem contexto extra', () => {
  const r = rodar(HOOK, prompt('Explique a diferença entre severidade e prioridade'));
  assert.equal(r.exit, 0);
  assert.equal(r.stdout, '', 'stdout deve ficar vazio para não poluir o contexto');
});

test('1.6 fail-open: entrada inválida nunca bloqueia o prompt', async () => {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [HOOK], { input: 'isto não é JSON', encoding: 'utf8' });
  assert.notEqual(r.status, 2, 'um erro interno não pode descartar o prompt da pessoa usuária');
});
