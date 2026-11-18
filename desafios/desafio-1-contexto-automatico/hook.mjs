#!/usr/bin/env node
// DESAFIO 1 — Contexto automático (UserPromptSubmit)  ·  nível: 🟢 básico
// Leia o ENUNCIADO.md desta pasta. Corrija com:  npm run desafios:corrigir
//
// Dicas:
//  - entrada.prompt contém o texto digitado pela pessoa.
//  - permitir(texto) → exit 0 e o texto vira CONTEXTO extra para o Claude.
//  - bloquear(texto) → exit 2: o prompt é descartado e o texto é mostrado à pessoa.
//  - O front matter das histórias tem as linhas "titulo: ..." e "regras: [RN-11, RN-12]".

import fs from 'node:fs';
import path from 'node:path';
import { lerEntrada, raizDoProjeto, bloquear, permitir } from '../../guardrails/hooks/lib/entrada.js';

/** Lista as histórias de requisitos/ como { id, arquivo, titulo, regras[] }. */
function historiasDisponiveis(raiz) {
  const pasta = path.join(raiz, 'requisitos');
  return fs.readdirSync(pasta)
    .filter((f) => /^US-\d{2}-.*\.md$/.test(f))
    .map((f) => {
      const texto = fs.readFileSync(path.join(pasta, f), 'utf8');
      return {
        id: f.slice(0, 5),
        arquivo: `requisitos/${f}`,
        titulo: '', // TODO 1: extraia o título do front matter (linha "titulo: ...")
        regras: [] // TODO 2: extraia a lista de regras do front matter (linha "regras: [...]")
      };
    });
}

// TODO 3: a leitura da entrada pode falhar (JSON inválido). Garanta o comportamento fail-open.
const entrada = lerEntrada();
const raiz = raizDoProjeto(entrada);

// TODO 4: encontre as histórias citadas no prompt (US-01, us-04 ...), sem repetição.
const citadas = [];

if (citadas.length === 0) permitir();

const historias = historiasDisponiveis(raiz);

// TODO 5: se alguma história citada não existir, bloqueie listando as disponíveis.

// TODO 6: monte o contexto (id, título, regras e arquivo de cada história citada) e chame permitir(contexto).
permitir();
