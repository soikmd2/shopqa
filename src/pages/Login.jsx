import { useState } from 'react';
import { useLoja } from '../context/LojaContext.jsx';
import { Link, navegar } from '../components/Roteador.jsx';

export default function Login({ voltar = '/' }) {
  const { entrar } = useLoja();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await entrar(email, senha);
      navegar(voltar);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="container form-pagina">
      <h1>Entrar</h1>
      <form onSubmit={enviar} data-testid="form-login">
        <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" autoComplete="username" /></label>
        <label>Senha<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} data-testid="login-senha" autoComplete="current-password" /></label>
        {erro && <p className="erro" data-testid="erro-login">{erro}</p>}
        <button className="botao botao--primario botao--bloco" disabled={carregando} data-testid="botao-entrar">
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>Não tem conta? <Link para={`/cadastro?voltar=${voltar}`} data-testid="link-cadastro">Cadastre-se</Link></p>
      <details className="contas-demo">
        <summary>Contas de demonstração</summary>
        <ul>
          <li>cliente@shopqa.com · Senha123 (1 pedido anterior)</li>
          <li>novo@shopqa.com · Senha123 (nenhum pedido)</li>
          <li>veterana@shopqa.com · Senha123 (2 pedidos anteriores)</li>
          <li>bloqueio@shopqa.com · Senha123 (use para testar bloqueio)</li>
        </ul>
      </details>
    </section>
  );
}
