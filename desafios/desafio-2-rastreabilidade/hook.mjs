#!/usr/bin/env node
// DESAFIO 2 — Rastreabilidade anti-alucinação (PostToolUse · matcher Write|Edit)  ·  nível: 🟡 intermediário
// Leia o ENUNCIADO.md desta pasta. Corrija com:  npm run desafios:corrigir
//
// Dicas:
//  - entrada.tool_input.file_path é o arquivo que o Claude acabou de escrever.
//  - Em PostToolUse a escrita JÁ aconteceu: bloquear() (exit 2) devolve o erro para o Claude corrigir.
//  - As regras existentes são as linhas da tabela que começam com "| RN-xx |" em requisitos/regras-de-negocio.md.
//  - Um critério existe se o texto "AC-04.5" aparece no arquivo da história US-04.

import fs from 'node:fs';
import path from 'node:path';
import { lerEntrada, raizDoProjeto, caminhoRelativo, bloquear, permitir } from '../../guardrails/hooks/lib/entrada.js';

const ALVO = /^qa\/casos-de-teste\/[^/]+\.json$/;

const entrada = lerEntrada();
const raiz = raizDoProjeto(entrada);
const arquivo = entrada?.tool_input?.file_path;
if (!arquivo) permitir();

const relativo = caminhoRelativo(arquivo, raiz);
// TODO 1: ignore (permitir) arquivos que não sejam casos de teste.

// TODO 2: leia e faça o parse do JSON. Se for inválido, bloqueie com uma mensagem que mencione "JSON".
const documento = { casos: [] };

// TODO 3: carregue o conjunto de regras existentes (RN-xx) e uma forma de ler o texto de cada US.

const erros = [];
for (const caso of documento.casos) {
  // TODO 4: a história existe?   ex.: "TC-CUP-101: a história US-42 não existe em requisitos/."
  // TODO 5: o critério existe na história?
  // TODO 6: cada regra existe?
}

// TODO 7: se houver erros, bloqueie listando TODOS (cite o id do caso e a referência inválida).
permitir();
