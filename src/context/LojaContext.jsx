import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as api from '../services/api.js';
import { adicionarItem, alterarQuantidade, removerItem } from '../domain/carrinho.js';
import { validarCupom } from '../domain/cupons.js';
import { calcularSubtotal } from '../domain/carrinho.js';

const LojaContext = createContext(null);

export function LojaProvider({ children }) {
  const [usuario, setUsuario] = useState(() => api.usuarioDaSessao());
  const [itens, setItens] = useState([]);
  const [cupom, setCupom] = useState(null);
  const [cep, setCep] = useState('');
  const [aviso, setAviso] = useState(null);

  const notificar = useCallback((texto, tipo = 'info') => {
    setAviso({ texto, tipo, id: Date.now() });
    setTimeout(() => setAviso((a) => (a && a.texto === texto ? null : a)), 3500);
  }, []);

  const adicionarAoCarrinho = useCallback((produto, quantidade) => {
    const r = adicionarItem(itens, produto, quantidade);
    if (r.erro) {
      notificar(r.erro, 'erro');
      return;
    }
    setItens(r.itens);
    notificar(`"${produto.nome}" adicionado ao carrinho.`, 'sucesso');
  }, [itens, notificar]);

  const mudarQuantidade = useCallback((id, qtd) => setItens((a) => alterarQuantidade(a, id, qtd)), []);
  const remover = useCallback((id) => setItens((a) => removerItem(a, id)), []);
  const limparCarrinho = useCallback(() => { setItens([]); setCupom(null); }, []);

  const aplicarCupom = useCallback((codigo) => {
    const r = validarCupom(codigo, { subtotal: calcularSubtotal(itens), usuario });
    if (r.ok) {
      setCupom(r.cupom);
      notificar(`Cupom ${r.cupom.codigo} aplicado: ${r.cupom.descricao}.`, 'sucesso');
    }
    return r;
  }, [itens, usuario, notificar]);

  const removerCupom = useCallback(() => setCupom(null), []);

  const entrar = useCallback(async (email, senha) => {
    const u = await api.login(email, senha);
    setUsuario(u);
    return u;
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const u = await api.cadastrar(dados);
    setUsuario(u);
    return u;
  }, []);

  const sair = useCallback(() => {
    api.logout();
    setUsuario(null);
    setCupom(null);
  }, []);

  const recarregarUsuario = useCallback(() => setUsuario(api.usuarioDaSessao()), []);

  const valor = useMemo(() => ({
    usuario, itens, cupom, cep, aviso,
    setCep, notificar,
    adicionarAoCarrinho, mudarQuantidade, remover, limparCarrinho,
    aplicarCupom, removerCupom,
    entrar, cadastrar, sair, recarregarUsuario
  }), [usuario, itens, cupom, cep, aviso, notificar, adicionarAoCarrinho, mudarQuantidade, remover, limparCarrinho, aplicarCupom, removerCupom, entrar, cadastrar, sair, recarregarUsuario]);

  return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}

export function useLoja() {
  const ctx = useContext(LojaContext);
  if (!ctx) throw new Error('useLoja deve ser usado dentro de <LojaProvider>');
  return ctx;
}
