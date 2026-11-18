// Formas de pagamento, parcelamento e validação de cartão (US-07).

import { arredondar, somenteDigitos } from './formatadores.js';

export const DESCONTO_PIX = 0.05;
export const MAX_PARCELAS = 10;
export const PARCELA_MINIMA = 20.0;

export function calcularDescontoPix(valorBase) {
  return arredondar(valorBase * DESCONTO_PIX);
}

/**
 * Opções de parcelamento sem juros.
 * @returns {Array<{ parcelas: number, valorParcela: number }>}
 */
export function opcoesDeParcelamento(total) {
  const opcoes = [];
  for (let n = 1; n <= MAX_PARCELAS; n++) {
    const valorParcela = Math.floor((total / n) * 100) / 100;
    if (n > 1 && valorParcela < PARCELA_MINIMA) break;
    opcoes.push({ parcelas: n, valorParcela });
  }
  return opcoes;
}

// Algoritmo de Luhn
export function numeroCartaoValido(numero = '') {
  const d = somenteDigitos(numero);
  if (d.length !== 16) return false;
  let soma = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    soma += n;
  }
  return soma % 10 === 0;
}

export function validadeCartaoValida(mmaa = '', hoje = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(mmaa.trim());
  if (!m) return false;
  const mes = Number(m[1]);
  const ano = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return false;
  const fimDoMes = new Date(ano, mes, 0, 23, 59, 59);
  return fimDoMes >= hoje;
}

export function cvvValido(cvv = '') {
  return /^\d{3}$/.test(cvv.trim());
}
