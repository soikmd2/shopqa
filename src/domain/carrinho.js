// Regras do carrinho de compras (US-03).
// Estrutura do item: { id, nome, preco, emoji, quantidade, estoque }

import { arredondar } from './formatadores.js';

export const QTD_MAXIMA_POR_ITEM = 10;

export function limiteDoItem(estoque) {
  return Math.min(QTD_MAXIMA_POR_ITEM, estoque);
}

export function adicionarItem(itens, produto, quantidade = 1) {
  if (produto.estoque <= 0) {
    return { itens, erro: 'Produto esgotado.' };
  }
  const qtd = Math.max(1, Math.floor(quantidade));
  const existente = itens.find((i) => i.id === produto.id);

  if (existente) {
    return {
      itens: itens.map((i) =>
        i.id === produto.id ? { ...i, quantidade: i.quantidade + qtd } : i
      ),
      erro: null
    };
  }

  const novo = {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    emoji: produto.emoji,
    estoque: produto.estoque,
    quantidade: Math.min(qtd, limiteDoItem(produto.estoque))
  };
  return { itens: [...itens, novo], erro: null };
}

export function alterarQuantidade(itens, id, quantidade) {
  return itens
    .map((i) => {
      if (i.id !== id) return i;
      const limite = limiteDoItem(i.estoque);
      const qtd = Math.min(Math.max(0, Math.floor(quantidade)), limite);
      return { ...i, quantidade: qtd };
    })
    .filter((i) => i.quantidade > 0);
}

export function removerItem(itens, id) {
  return itens.filter((i) => i.id !== id);
}

export function contarItens(itens) {
  return itens.reduce((soma, i) => soma + i.quantidade, 0);
}

export function calcularSubtotal(itens) {
  return arredondar(itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0));
}
