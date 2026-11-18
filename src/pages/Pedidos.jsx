import { useEffect, useState } from 'react';
import { useLoja } from '../context/LojaContext.jsx';
import { Link, navegar } from '../components/Roteador.jsx';
import * as api from '../services/api.js';
import { formatarMoeda } from '../domain/formatadores.js';

export default function Pedidos() {
  const { usuario } = useLoja();
  const [pedidos, setPedidos] = useState(null);

  useEffect(() => {
    if (!usuario) {
      navegar('/login?voltar=/pedidos');
      return;
    }
    api.listarPedidos(usuario.id).then(setPedidos);
  }, [usuario]);

  if (!usuario || !pedidos) return <p className="container carregando">Carregando...</p>;

  return (
    <section className="container">
      <h1>Meus pedidos</h1>
      {pedidos.length === 0 ? (
        <div className="vazio" data-testid="sem-pedidos">Você ainda não fez pedidos. <Link para="/">Começar a comprar</Link></div>
      ) : (
        <table className="tabela-itens" data-testid="tabela-pedidos">
          <thead><tr><th>Pedido</th><th>Data</th><th>Itens</th><th>Pagamento</th><th>Total cobrado</th><th>Status</th></tr></thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} data-testid={`pedido-${p.id}`}>
                <td><Link para={`/pedido/${p.id}`}>#{p.id}</Link></td>
                <td>{new Date(p.data).toLocaleString('pt-BR')}</td>
                <td>{p.itens.map((i) => `${i.quantidade}× ${i.nome}`).join(', ')}</td>
                <td>{p.formaPagamento === 'pix' ? 'PIX' : `Cartão ${p.parcelas}x`}</td>
                <td data-testid={`pedido-valor-${p.id}`}>{formatarMoeda(p.valorCobrado)}</td>
                <td><span className="status">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
