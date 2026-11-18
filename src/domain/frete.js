// Cálculo de frete por CEP (US-05).

import { somenteDigitos } from './formatadores.js';

export const VALOR_MINIMO_FRETE_GRATIS = 299.0;

// Tabela por faixa do primeiro dígito do CEP.
export const TABELA_FRETE = [
  { faixa: [0, 1], regiao: 'SP', valor: 14.9, prazo: 2 },
  { faixa: [2, 3], regiao: 'RJ / ES / MG', valor: 19.9, prazo: 3 },
  { faixa: [4, 6], regiao: 'Nordeste / Norte', valor: 29.9, prazo: 6 },
  { faixa: [7, 7], regiao: 'Centro-Oeste / DF', valor: 24.9, prazo: 5 },
  { faixa: [8, 9], regiao: 'Sul', valor: 22.9, prazo: 4 }
];

export function cepValido(cep = '') {
  return /^\d{5}-?\d{2,3}$/.test(String(cep).trim());
}

export function formatarCep(cep = '') {
  const d = somenteDigitos(cep).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/**
 * @param {string} cep
 * @param {number} baseCalculo subtotal de produtos já com desconto de cupom
 * @param {object|null} cupom cupom aplicado (pode ser do tipo "frete")
 */
export function calcularFrete(cep, baseCalculo, cupom = null) {
  if (!cepValido(cep)) return { ok: false, erro: 'CEP inválido.' };

  const primeiroDigito = Number(somenteDigitos(cep)[0]);
  const linha = TABELA_FRETE.find(
    (l) => primeiroDigito >= l.faixa[0] && primeiroDigito <= l.faixa[1]
  );

  const gratis =
    baseCalculo > VALOR_MINIMO_FRETE_GRATIS || (cupom && cupom.tipo === 'frete');

  return {
    ok: true,
    regiao: linha.regiao,
    prazo: linha.prazo,
    valor: gratis ? 0 : linha.valor,
    gratis: Boolean(gratis)
  };
}
