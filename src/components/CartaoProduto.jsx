import { Link } from './Roteador.jsx';
import { formatarMoeda } from '../domain/formatadores.js';
import { useLoja } from '../context/LojaContext.jsx';

export default function CartaoProduto({ produto }) {
  const { adicionarAoCarrinho } = useLoja();
  const esgotado = produto.estoque <= 0;

  return (
    <article className="produto-card" data-testid={`produto-card-${produto.id}`}>
      <Link para={`/produto/${produto.id}`} className="produto-card__imagem" aria-label={produto.nome}>
        <span>{produto.emoji}</span>
      </Link>
      <div className="produto-card__corpo">
        <span className="tag">{produto.categoria}</span>
        <Link para={`/produto/${produto.id}`} className="produto-card__nome" data-testid="produto-nome">
          {produto.nome}
        </Link>
        <strong className="produto-card__preco" data-testid="produto-preco">{formatarMoeda(produto.preco)}</strong>
        {esgotado ? (
          <span className="esgotado" data-testid="produto-esgotado">Esgotado</span>
        ) : produto.estoque <= 5 ? (
          <span className="ultimas" data-testid="produto-ultimas">Últimas {produto.estoque} unidades</span>
        ) : (
          <span className="disponivel">Em estoque</span>
        )}
        <button
          className="botao botao--primario"
          disabled={esgotado}
          onClick={() => adicionarAoCarrinho(produto, 1)}
          data-testid={`botao-adicionar-${produto.id}`}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}
