import { useEffect, useState } from 'react';
import { useLoja } from '../context/LojaContext.jsx';
import { Link } from '../components/Roteador.jsx';
import * as api from '../services/api.js';
import { formatarMoeda } from '../domain/formatadores.js';

export default function Confirmacao({ id }) {
  const { usuario } = useLoja();
  const [pedido, setPedido] = useState(undefined);

  useEffect(() => {
    if (!usuario) return;
    api.listarPedidos(usuario.id).then((lista) => setPedido(lista.find((p) => p.id === Number(id)) || null));
  }, [id, usuario]);

  if (pedido === undefined) return <p className="container carregando">Carregando...</p>;
  if (!pedido) return <p className="container vazio">Pedido não encontrado.</p>;

  return (
    <section className="container confirmacao" data-testid="confirmacao-pedido">
      <div className="confirmacao__icone">✅</div>
      <h1>Pedido #{pedido.id} confirmado!</h1>
      <p>Enviamos os detalhes para {usuario.email}.</p>
      <dl className="resumo">
        <dt>Subtotal</dt><dd>{formatarMoeda(pedido.subtotal)}</dd>
        {pedido.descontoCupom > 0 && (<><dt>Cupom {pedido.cupom}</dt><dd>− {formatarMoeda(pedido.descontoCupom)}</dd></>)}
        <dt>Frete</dt><dd>{pedido.frete === 0 ? 'Grátis' : formatarMoeda(pedido.frete)}</dd>
        {pedido.descontoPix > 0 && (<><dt>Desconto PIX</dt><dd>− {formatarMoeda(pedido.descontoPix)}</dd></>)}
        <dt className="total">Total cobrado</dt><dd className="total" data-testid="confirmacao-total">{formatarMoeda(pedido.valorCobrado)}</dd>
        <dt>Pagamento</dt><dd>{pedido.formaPagamento === 'pix' ? 'PIX' : `Cartão em ${pedido.parcelas}x`}</dd>
      </dl>
      <Link para="/pedidos" className="botao">Ver meus pedidos</Link>{' '}
      <Link para="/" className="botao botao--primario">Continuar comprando</Link>
    </section>
  );
}
