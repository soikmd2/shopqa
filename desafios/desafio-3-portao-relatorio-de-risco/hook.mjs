#!/usr/bin/env node
// DESAFIO 3 — Portão de qualidade do relatório de risco (Stop)  ·  nível: 🔴 avançado
// Leia o ENUNCIADO.md desta pasta. Corrija com:  npm run desafios:corrigir
//
// Dicas:
//  - Stop dispara quando o Claude acha que terminou. bloquear() (exit 2) o obriga a continuar
//    e o texto do stderr vira a próxima instrução para ele.
//  - entrada.stop_hook_active === true significa "esta parada já foi provocada por um Stop hook".
//    Bloquear de novo pode criar um LOOP INFINITO.
//  - responderJson({ systemMessage: '...' }) libera (exit 0) e mostra um aviso à pessoa usuária.
//  - Veja um relatório válido em exemplo-valido.md.

import fs from 'node:fs';
import path from 'node:path';
import { lerEntrada, raizDoProjeto, bloquear, permitir, responderJson } from '../../guardrails/hooks/lib/entrada.js';

/** Devolve a lista de problemas de UM relatório (vazia = relatório aprovado). */
export function problemasDoRelatorio(texto) {
  const problemas = [];
  // TODO 1: as 6 seções "## 1." … "## 6." existem com os títulos esperados?
  // TODO 2: a matriz (seção 3) tem ao menos 3 linhas de risco "| R1 | ..."?
  // TODO 3: cada linha da matriz termina com um nível numérico de 1 a 9?
  // TODO 4: a recomendação (seção 6) contém APROVAR, APROVAR COM RESSALVAS ou BLOQUEAR?
  // TODO 5: "APROVAR" com algum risco de nível ≥ 6 é incoerente.
  return problemas;
}

const entrada = lerEntrada();
const raiz = raizDoProjeto(entrada);
const pasta = process.env.SHOPQA_RISCOS_DIR || path.join(raiz, 'qa', 'riscos');
if (!fs.existsSync(pasta)) permitir();

// TODO 6: avalie apenas arquivos RISCO-PR-<número>.md e junte os problemas no formato "arquivo: problema".
const erros = [];

if (erros.length === 0) permitir();

// TODO 7: trate stop_hook_active para não criar loop infinito.

// TODO 8: bloqueie listando os problemas.
permitir();
