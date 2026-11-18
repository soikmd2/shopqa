import { useEffect, useState } from 'react';
import * as api from '../services/api.js';
import { useLoja } from '../context/LojaContext.jsx';
import { Link } from '../components/Roteador.jsx';
import { formatarMoeda } from '../domain/formatadores.js';
import { limiteDoItem } from '../domain/carrinho.js';
import {
  formatarComentario,
  mediaDasNotas,
  TAMANHO_MAXIMO_COMENTARIO,
  validarAvaliacao
} from '../domain/avaliacoes.js';

function Estrelas({ nota }) {
  return <span className="estrelas" aria-label={`${nota} de 5`}>{'★'.repeat(nota)}{'☆'.repeat(5 - nota)}</span>;
}

export default function Produto({ id }) {
  const { adicionarAoCarrinho, usuario, notificar } = useLoja();
  const [produto, setProduto] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [errosAvaliacao, setErrosAvaliacao] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setCarregado(false);
    Promise.all([api.obterProduto(id), api.listarAvaliacoes(id)]).then(([p, a]) => {
      setProduto(p);
      setAvaliacoes(a);
      setQuantidade(1);
      setCarregado(true);
    });
  }, [id]);

  if (!carregado) return <p className="container carregando">Carregando...</p>;
  if (!produto) {
    return (
      <section className="container vazio" data-testid="produto-nao-encontrado">
        Produto não encontrado. <Link para="/">Voltar ao catálogo</Link>
      </section>
    );
  }

  const limite = limiteDoItem(produto.estoque);
  const esgotado = produto.estoque <= 0;

  async function enviarAvaliacao(e) {
    e.preventDefault();
    const erros = validarAvaliacao({ nota, comentario });
    setErrosAvaliacao(erros);
    if (erros.length) return;
    const nova = await api.criarAvaliacao({ produtoId: produto.id, usuario, nota, comentario });
    setAvaliacoes((a) => [nova, ...a]);
    setNota(0);
    setComentario('');
    notificar('Avaliação publicada. Obrigado!', 'sucesso');
  }

  return (
    <section className="container produto-detalhe">
      <Link para="/" className="voltar">← Voltar ao catálogo</Link>

      <div className="produto-detalhe__topo">
        <div className="produto-detalhe__imagem">{produto.emoji}</div>
        <div>
          <span className="tag">{produto.categoria}</span>
          <h1 data-testid="detalhe-nome">{produto.nome}</h1>
          <p className="media">
            <Estrelas nota={Math.round(mediaDasNotas(avaliacoes))} /> {mediaDasNotas(avaliacoes)} ({avaliacoes.length} avaliações)
          </p>
          <p>{produto.descricao}</p>
          <strong className="preco-grande" data-testid="detalhe-preco">{formatarMoeda(produto.preco)}</strong>
          <p className="parcelamento-info">ou até 10x sem juros · {formatarMoeda(produto.preco * 0.95)} no PIX</p>

          {esgotado ? (
            <p className="esgotado" data-testid="detalhe-esgotado">Produto esgotado</p>
          ) : (
            <div className="comprar">
              <label>
                Quantidade
                <input
                  type="number"
                  min={1}
                  max={limite}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.min(limite, Math.max(1, Number(e.target.value) || 1)))}
                  data-testid="detalhe-quantidade"
                />
              </label>
              <small>Máx. {limite} por pedido · {produto.estoque} em estoque</small>
              <button
                className="botao botao--primario"
                onClick={() => adicionarAoCarrinho(produto, quantidade)}
                data-testid="detalhe-adicionar"
              >
                Adicionar ao carrinho
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="avaliacoes">
        <h2>Avaliações</h2>
        {avaliacoes.length === 0 && <p data-testid="sem-avaliacoes">Este produto ainda não tem avaliações.</p>}
        <ul data-testid="lista-avaliacoes">
          {avaliacoes.map((a) => (
            <li key={a.id} className="avaliacao" data-testid="avaliacao-item">
              <div><Estrelas nota={a.nota} /> <strong>{a.autor}</strong> · <small>{new Date(a.data).toLocaleDateString('pt-BR')}</small></div>
              <p dangerouslySetInnerHTML={{ __html: formatarComentario(a.comentario) }} />
            </li>
          ))}
        </ul>

        {usuario ? (
          <form className="form-avaliacao" onSubmit={enviarAvaliacao} data-testid="form-avaliacao">
            <h3>Deixe sua avaliação</h3>
            <div className="seletor-nota" role="radiogroup" aria-label="Nota">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} className={n <= nota ? 'ativa' : ''} onClick={() => setNota(n)} data-testid={`nota-${n}`}>★</button>
              ))}
            </div>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              maxLength={TAMANHO_MAXIMO_COMENTARIO + 50}
              placeholder="Conte o que achou. Use **texto** para destacar em negrito."
              data-testid="campo-comentario"
            />
            <small>{comentario.length}/{TAMANHO_MAXIMO_COMENTARIO}</small>
            {errosAvaliacao.map((e) => <p key={e} className="erro" data-testid="erro-avaliacao">{e}</p>)}
            <button className="botao" type="submit" data-testid="botao-publicar-avaliacao">Publicar avaliação</button>
          </form>
        ) : (
          <p><Link para="/login">Entre</Link> para avaliar este produto.</p>
        )}
      </div>
    </section>
  );
}
