import { useRota, Link } from './components/Roteador.jsx';
import Cabecalho from './components/Cabecalho.jsx';
import Aviso from './components/Aviso.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Produto from './pages/Produto.jsx';
import Carrinho from './pages/Carrinho.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Confirmacao from './pages/Confirmacao.jsx';
import { resetarDadosDeDemo } from './services/api.js';

function Pagina() {
  const { caminho, params } = useRota();
  const voltar = params.get('voltar') || '/';
  let m;

  if (caminho === '/') return <Catalogo />;
  if ((m = caminho.match(/^\/produto\/(\d+)$/))) return <Produto id={m[1]} />;
  if (caminho === '/carrinho') return <Carrinho />;
  if (caminho === '/checkout') return <Checkout />;
  if (caminho === '/login') return <Login voltar={voltar} />;
  if (caminho === '/cadastro') return <Cadastro voltar={voltar} />;
  if (caminho === '/pedidos') return <Pedidos />;
  if ((m = caminho.match(/^\/pedido\/(\d+)$/))) return <Confirmacao id={m[1]} />;

  return (
    <section className="container vazio" data-testid="pagina-404">
      <h1>Página não encontrada</h1>
      <Link para="/">Voltar à loja</Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Cabecalho />
      <main>
        <Pagina />
      </main>
      <Aviso />
      <footer className="rodape">
        <div className="container">
          <span>ShopQA · loja de demonstração para o curso “IA para QAs”. Nenhuma compra é real.</span>
          <button
            className="link-botao"
            data-testid="resetar-dados"
            onClick={() => {
              if (window.confirm('Restaurar todos os dados de demonstração (usuários, estoque, pedidos, avaliações)?')) {
                resetarDadosDeDemo();
                window.location.hash = '#/';
                window.location.reload();
              }
            }}
          >
            Restaurar dados de demonstração
          </button>
        </div>
      </footer>
    </>
  );
}
