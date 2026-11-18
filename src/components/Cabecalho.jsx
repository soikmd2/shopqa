import { useLoja } from '../context/LojaContext.jsx';
import { Link, navegar } from './Roteador.jsx';
import { calcularSubtotal, contarItens } from '../domain/carrinho.js';

export default function Cabecalho() {
  const { usuario, itens, sair } = useLoja();
  const qtd = contarItens(itens);
  const subtotal = calcularSubtotal(itens);

  return (
    <header className="cabecalho">
      <div className="container cabecalho__conteudo">
        <Link para="/" className="logo" data-testid="logo">
          Shop<span>QA</span>
        </Link>

        <nav className="cabecalho__acoes">
          {usuario ? (
            <>
              <span className="saudacao" data-testid="saudacao-usuario">Olá, {usuario.nome.split(' ')[0]}</span>
              <Link para="/pedidos" data-testid="link-pedidos">Meus pedidos</Link>
              <button className="link-botao" onClick={() => { sair(); navegar('/'); }} data-testid="botao-sair">
                Sair
              </button>
            </>
          ) : (
            <Link para="/login" data-testid="link-login">Entrar</Link>
          )}

          <Link para="/carrinho" className="minicarrinho" data-testid="minicarrinho">
            🛒 <span className="minicarrinho__badge" data-testid="minicarrinho-quantidade">{qtd}</span>
            <span className="minicarrinho__total" data-testid="minicarrinho-total">
              {'R$ ' + subtotal.toFixed(2)}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
