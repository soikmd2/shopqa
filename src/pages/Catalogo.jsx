import { useEffect, useMemo, useState } from 'react';
import * as api from '../services/api.js';
import CartaoProduto from '../components/CartaoProduto.jsx';
import { CATEGORIAS } from '../domain/produtos.js';
import { buscarProdutos, filtrarPorCategoria, ordenarProdutos, ORDENACOES } from '../domain/busca.js';
import { rotuloQuantidadeItens } from '../domain/formatadores.js';

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [termo, setTermo] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [ordem, setOrdem] = useState('relevancia');

  useEffect(() => {
    api.listarProdutos().then((p) => {
      setProdutos(p);
      setCarregando(false);
    });
  }, []);

  const visiveis = useMemo(
    () => ordenarProdutos(filtrarPorCategoria(buscarProdutos(produtos, termo), categoria), ordem),
    [produtos, termo, categoria, ordem]
  );

  return (
    <section className="container">
      <div className="hero">
        <h1>Tudo para você testar (e comprar) 🧪</h1>
        <p>Frete grátis a partir de R$ 299,00 · 5% de desconto no PIX · até 10x sem juros</p>
      </div>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar produtos..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          data-testid="campo-busca"
          aria-label="Buscar produtos"
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} data-testid="filtro-categoria" aria-label="Categoria">
          <option>Todas</option>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={ordem} onChange={(e) => setOrdem(e.target.value)} data-testid="ordenacao" aria-label="Ordenar por">
          {Object.entries(ORDENACOES).map(([v, rotulo]) => <option key={v} value={v}>{rotulo}</option>)}
        </select>
      </div>

      {carregando ? (
        <p className="carregando" data-testid="carregando">Carregando produtos...</p>
      ) : (
        <>
          <p className="contagem" data-testid="contagem-resultados">
            {rotuloQuantidadeItens(visiveis.length)} {visiveis.length === 1 ? 'encontrado' : 'encontrados'}
          </p>
          {visiveis.length === 0 ? (
            <div className="vazio" data-testid="busca-sem-resultados">
              Nenhum produto encontrado para “{termo}”.
            </div>
          ) : (
            <div className="grade">
              {visiveis.map((p) => <CartaoProduto key={p.id} produto={p} />)}
            </div>
          )}
        </>
      )}
    </section>
  );
}
