import { useState } from 'react';
import { useLoja } from '../context/LojaContext.jsx';
import { Link, navegar } from '../components/Roteador.jsx';
import { cpfValido, emailValido, problemasDaSenha } from '../domain/autenticacao.js';

export default function Cadastro({ voltar = '/' }) {
  const { cadastrar } = useLoja();
  const [dados, setDados] = useState({ nome: '', email: '', cpf: '', senha: '', confirmacao: '', termos: false });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');

  const set = (k) => (e) => setDados((d) => ({ ...d, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function validar() {
    const e = {};
    if (dados.nome.trim().split(/\s+/).length < 2) e.nome = 'Informe nome e sobrenome.';
    if (!emailValido(dados.email)) e.email = 'E-mail inválido.';
    if (!cpfValido(dados.cpf)) e.cpf = 'CPF inválido.';
    const p = problemasDaSenha(dados.senha);
    if (p.length) e.senha = `A senha precisa de: ${p.join(', ')}.`;
    if (dados.senha !== dados.confirmacao) e.confirmacao = 'As senhas não conferem.';
    if (!dados.termos) e.termos = 'É necessário aceitar os termos de uso.';
    return e;
  }

  async function enviar(ev) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    setErroGeral('');
    if (Object.keys(e).length) return;
    try {
      await cadastrar(dados);
      navegar(voltar);
    } catch (err) {
      setErroGeral(err.message);
    }
  }

  const erro = (k) => erros[k] && <span className="erro" data-testid={`erro-${k}`}>{erros[k]}</span>;

  return (
    <section className="container form-pagina">
      <h1>Criar conta</h1>
      <form onSubmit={enviar} noValidate data-testid="form-cadastro">
        <label>Nome completo<input value={dados.nome} onChange={set('nome')} data-testid="cadastro-nome" />{erro('nome')}</label>
        <label>E-mail<input type="email" value={dados.email} onChange={set('email')} data-testid="cadastro-email" />{erro('email')}</label>
        <label>CPF<input value={dados.cpf} onChange={set('cpf')} placeholder="000.000.000-00" data-testid="cadastro-cpf" />{erro('cpf')}</label>
        <label>Senha<input type="password" value={dados.senha} onChange={set('senha')} data-testid="cadastro-senha" />{erro('senha')}</label>
        <label>Confirmar senha<input type="password" value={dados.confirmacao} onChange={set('confirmacao')} data-testid="cadastro-confirmacao" />{erro('confirmacao')}</label>
        <label className="checkbox"><input type="checkbox" checked={dados.termos} onChange={set('termos')} data-testid="cadastro-termos" /> Li e aceito os termos de uso</label>
        {erro('termos')}
        {erroGeral && <p className="erro" data-testid="erro-cadastro">{erroGeral}</p>}
        <button className="botao botao--primario botao--bloco" data-testid="botao-cadastrar">Criar conta</button>
      </form>
      <p>Já tem conta? <Link para="/login">Entrar</Link></p>
    </section>
  );
}
