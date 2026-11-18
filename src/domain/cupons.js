// Regras de cupons de desconto (US-04).

import { arredondar, formatarData } from './formatadores.js';

export const CUPONS = {
  PRIMEIRACOMPRA: {
    codigo: 'PRIMEIRACOMPRA',
    tipo: 'percentual',
    valor: 10,
    validade: '31/12/2030',
    primeiraCompra: true,
    descricao: '10% de desconto na primeira compra'
  },
  BLACK50: {
    codigo: 'BLACK50',
    tipo: 'fixo',
    valor: 50,
    minimo: 300,
    validade: '31/12/2030',
    descricao: 'R$ 50,00 de desconto em compras a partir de R$ 300,00'
  },
  FRETEGRATIS: {
    codigo: 'FRETEGRATIS',
    tipo: 'frete',
    valor: 0,
    minimo: 150,
    validade: '31/12/2030',
    descricao: 'Frete grátis em compras a partir de R$ 150,00'
  },
  QA15: {
    codigo: 'QA15',
    tipo: 'percentual',
    valor: 15,
    validade: '31/12/2030',
    descricao: '15% de desconto (campanha comunidade QA)'
  },
  ANIVERSARIO20: {
    codigo: 'ANIVERSARIO20',
    tipo: 'percentual',
    valor: 20,
    validade: '31/12/2025',
    descricao: '20% de desconto — campanha de aniversário 2025'
  },
  VERAO10: {
    codigo: 'VERAO10',
    tipo: 'percentual',
    valor: 10,
    validade: '01/03/2025',
    descricao: '10% de desconto — campanha de verão 2025'
  }
};

export function cupomExpirado(cupom, hoje = new Date()) {
  return cupom.validade < formatarData(hoje);
}

/**
 * Valida um código de cupom para o contexto atual.
 * @returns {{ ok: boolean, cupom?: object, erro?: string }}
 */
export function validarCupom(codigo, { subtotal, usuario, hoje = new Date() } = {}) {
  const chave = String(codigo || '').trim().toUpperCase();
  if (!chave) return { ok: false, erro: 'Informe um código de cupom.' };

  const cupom = CUPONS[chave];
  if (!cupom) return { ok: false, erro: 'Cupom inválido.' };

  if (cupomExpirado(cupom, hoje)) return { ok: false, erro: 'Cupom expirado.' };

  if (cupom.minimo && subtotal < cupom.minimo) {
    return {
      ok: false,
      erro: `Este cupom exige compras a partir de R$ ${cupom.minimo.toFixed(2).replace('.', ',')}.`
    };
  }

  if (cupom.primeiraCompra) {
    if (!usuario) return { ok: false, erro: 'Faça login para usar este cupom.' };
    if (usuario.pedidos.length > 1) {
      return { ok: false, erro: 'Cupom válido apenas para a primeira compra.' };
    }
  }

  return { ok: true, cupom };
}

/** Valor do desconto que o cupom aplica sobre o subtotal de produtos. */
export function calcularDescontoCupom(cupom, subtotal) {
  if (!cupom) return 0;
  if (cupom.tipo === 'percentual') return arredondar((subtotal * cupom.valor) / 100);
  if (cupom.tipo === 'fixo') return Math.min(cupom.valor, subtotal);
  return 0; // cupom de frete não altera o subtotal
}
