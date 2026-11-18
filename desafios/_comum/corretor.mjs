// Utilitários dos corretores automáticos dos desafios.
// Por padrão corrige o hook do aluno (desafios/<desafio>/hook.mjs).
// O professor valida as soluções com:  SOLUCAO=1 npm run desafios:corrigir

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { executarHook } from '../../guardrails/testar-hook.mjs';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function caminhoDoHook(pastaDesafio, numero) {
  const solucao = path.join(RAIZ, 'professor', 'solucoes', `desafio-${numero}.mjs`);
  if (process.env.SOLUCAO === '1' && fs.existsSync(solucao)) return solucao;
  return path.join(RAIZ, 'desafios', pastaDesafio, 'hook.mjs');
}

export function rodar(hook, entrada, env = {}) {
  return executarHook(hook, entrada, env);
}

/** Cria uma cópia mínima do projeto (requisitos + pastas de QA) numa pasta temporária. */
export function projetoTemporario() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shopqa-desafio-'));
  fs.cpSync(path.join(RAIZ, 'requisitos'), path.join(dir, 'requisitos'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'qa', 'casos-de-teste'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'qa', 'riscos'), { recursive: true });
  return {
    dir,
    escrever(relativo, conteudo) {
      const alvo = path.join(dir, relativo);
      fs.mkdirSync(path.dirname(alvo), { recursive: true });
      fs.writeFileSync(alvo, typeof conteudo === 'string' ? conteudo : JSON.stringify(conteudo, null, 2));
      return alvo;
    },
    remover() { fs.rmSync(dir, { recursive: true, force: true }); }
  };
}
