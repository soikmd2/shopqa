// Funções utilitárias de formatação e arredondamento.

export function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function rotuloQuantidadeItens(qtd) {
  return `${qtd} ${qtd > 1 ? 'itens' : 'item'}`;
}

// Converte Date -> "DD/MM/AAAA"
export function formatarData(data) {
  const d = String(data.getDate()).padStart(2, '0');
  const m = String(data.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${data.getFullYear()}`;
}

export function somenteDigitos(texto = '') {
  return String(texto).replace(/\D/g, '');
}
