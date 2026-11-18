#!/usr/bin/env node
// EXEMPLO 4 — UserPromptSubmit (sem matcher)
// Dois comportamentos no mesmo hook:
//   1) BLOQUEIO: o prompt contém dados pessoais/sensíveis reais (CPF válido, cartão válido, chave de API)
//      → exit 2: o prompt é descartado ANTES de chegar ao modelo e a pessoa vê o motivo (LGPD / RNF-04).
//   2) ENRIQUECIMENTO: o prompt fala de casos de teste → imprime lembretes no stdout,
//      que o Claude Code injeta como contexto adicional.

import { lerEntrada, bloquear, permitir } from './lib/entrada.js';

// Dados fictícios oficiais da ShopQA (podem aparecer em prompts).
const CPFS_DE_TESTE = ['52998224725', '11144477735', '39053344705', '28625587887', '93541134780'];
const CARTOES_DE_TESTE = ['4111111111111111', '5555555555554444', '4000000000000002'];

const digitos = (s) => s.replace(/\D/g, '');

function cpfValido(d) {
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dv = (n) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}

function luhn(d) {
  let soma = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    soma += n;
  }
  return soma % 10 === 0;
}

export function encontrarDadosSensiveis(texto) {
  const achados = [];
  for (const m of texto.match(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g) || []) {
    const d = digitos(m);
    if (cpfValido(d) && !CPFS_DE_TESTE.includes(d)) achados.push(`CPF real/válido (${m.slice(0, 3)}.***.***-**)`);
  }
  for (const m of texto.match(/\b(?:\d[ -]?){13,19}\b/g) || []) {
    const d = digitos(m);
    if (d.length >= 13 && d.length <= 19 && luhn(d) && !CARTOES_DE_TESTE.includes(d)) achados.push(`número de cartão válido (final ${d.slice(-4)})`);
  }
  if (/\b(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,})\b/.test(texto)) achados.push('chave de API / token');
  return achados;
}

try {
  const { prompt = '' } = lerEntrada();
  const achados = encontrarDadosSensiveis(prompt);

  if (achados.length) {
    bloquear(
      `🔒 GUARDRAIL E4 — seu prompt NÃO foi enviado. Encontrei: ${[...new Set(achados)].join('; ')}.\n` +
      'Dados reais não podem ser compartilhados com a IA (RNF-04 / LGPD).\n' +
      'Use a massa fictícia da ShopQA (ex.: CPF 529.982.247-25, cartão 4111 1111 1111 1111) e envie novamente.'
    );
  }

  if (/casos? de teste|test ?cases?/i.test(prompt)) {
    permitir(
      'Lembretes automáticos do projeto ShopQA (hook E4):\n' +
      '- Salve casos de teste em qa/casos-de-teste/*.json seguindo guardrails/schemas/caso-de-teste.schema.json.\n' +
      '- Todo caso deve referenciar uma US e um AC existentes em requisitos/.\n' +
      '- Use apenas a massa de dados fictícia listada em qa/massa-de-dados.md.'
    );
  }
  permitir();
} catch (erro) {
  // Falha ao analisar o prompt: por privacidade, bloqueia (fail-closed).
  bloquear(`🔒 GUARDRAIL E4 — não consegui analisar o prompt (${erro.message}). Tente novamente.`);
}
