// Busca, filtro e ordenação do catálogo (US-01).

export function normalizar(texto = '') {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function buscarProdutos(produtos, termo = '') {
  const t = normalizar(termo.trim());
  if (t.length === 0) return produtos;
  return produtos.filter((p) => normalizar(p.nome).includes(t));
}

export function filtrarPorCategoria(produtos, categoria) {
  if (!categoria || categoria === 'Todas') return produtos;
  return produtos.filter((p) => p.categoria === categoria);
}

export const ORDENACOES = {
  relevancia: 'Mais vendidos',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
  nome: 'Nome (A-Z)'
};

export function ordenarProdutos(produtos, criterio = 'relevancia') {
  const lista = [...produtos];
  switch (criterio) {
    case 'menor-preco':
      return lista.sort((a, b) => a.preco - b.preco);
    case 'maior-preco':
      return lista.sort((a, b) => b.preco - a.preco);
    case 'nome':
      return lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    default:
      return lista.sort((a, b) => b.vendidos - a.vendidos);
  }
}
