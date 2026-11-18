// Composição do resumo financeiro do pedido (RN-20 — ordem de cálculo).

import { arredondar } from './formatadores.js';
import { calcularSubtotal } from './carrinho.js';
import { calcularDescontoCupom } from './cupons.js';
import { calcularFrete } from './frete.js';
import { calcularDescontoPix } from './pagamento.js';

/**
 * @param {{ itens: Array, cupom?: object|null, cep?: string, formaPagamento?: 'cartao'|'pix' }} params
 */
export function calcularResumo({ itens, cupom = null, cep = '', formaPagamento = 'cartao' }) {
  const subtotal = calcularSubtotal(itens);
  const descontoCupom = calcularDescontoCupom(cupom, subtotal);
  const base = arredondar(subtotal - descontoCupom);

  const frete = cep ? calcularFrete(cep, base, cupom) : null;
  const valorFrete = frete && frete.ok ? frete.valor : 0;

  const descontoPix =
    formaPagamento === 'pix' ? calcularDescontoPix(base + valorFrete) : 0;

  const total = arredondar(base + valorFrete - descontoPix);

  return { subtotal, descontoCupom, frete, valorFrete, descontoPix, total };
}
