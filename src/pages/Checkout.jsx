import { useEffect, useState } from 'react';
import { useLoja } from '../context/LojaContext.jsx';
import { Link, navegar } from '../components/Roteador.jsx';
import * as api from '../services/api.js';
import { formatarMoeda } from '../domain/formatadores.js';
import { calcularResumo } from '../domain/resumo.js';
import { cepValido, formatarCep } from '../domain/frete.js';
import {
  cvvValido,
  numeroCartaoValido,
  opcoesDeParcelamento,
  validadeCartaoValida
} from '../domain/pagamento.js';

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function Checkout() {
  const { usuario, itens, cupom, cep, setCep, limparCarrinho, recarregarUsuario } = useLoja();
  const [endereco, setEndereco] = useState({ cep, rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' });
  const [formaPagamento, setFormaPagamento] = useState('cartao');
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' });
  const [parcelas, setParcelas] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!usuario) navegar('/login?voltar=/checkout');
  }, [usuario]);

  useEffect(() => {
    if (cepValido(endereco.cep)) setCep(endereco.cep);
  }, [endereco.cep, setCep]);

  if (!usuario) return null;
  if (itens.length === 0) {
    return (
      <section className="container vazio" data-testid="checkout-vazio">
        Não há itens para finalizar. <Link para="/">Ver produtos</Link>
      </section>
    );
  }

  const resumo = calcularResumo({ itens, cupom, cep: endereco.cep, formaPagamento });
  const opcoes = opcoesDeParcelamento(resumo.total);
  const parcelamento = opcoes.find((o) => o.parcelas === Number(parcelas)) || opcoes[0];

  const enderecoOk =
    cepValido(endereco.cep) && endereco.rua.trim() && endereco.numero.trim() &&
    endereco.bairro.trim() && endereco.cidade.trim() && endereco.uf;

  const cartaoOk =
    numeroCartaoValido(cartao.numero) && cartao.nome.trim().length >= 3 &&
    validadeCartaoValida(cartao.validade) && cvvValido(cartao.cvv);

  const formValido = Boolean(enderecoOk && (formaPagamento === 'pix' || cartaoOk));

  const campo = (nome) => ({
    value: endereco[nome],
    onChange: (e) => setEndereco((d) => ({ ...d, [nome]: nome === 'cep' ? formatarCep(e.target.value) : e.target.value })),
    'data-testid': `endereco-${nome}`
  });

  async function confirmar() {
    setErro('');
    setEnviando(true);
    try {
      const pedido = await api.criarPedido({
        usuario, itens, resumo, formaPagamento, parcelamento, endereco, cupom
      });
      limparCarrinho();
      recarregarUsuario();
      navegar(`/pedido/${pedido.id}`);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="container checkout">
      <h1>Finalizar compra</h1>
      <div className="carrinho__layout">
        <div>
          <fieldset data-testid="secao-endereco">
            <legend>1. Endereço de entrega</legend>
            <div className="grid-form">
              <label>CEP<input {...campo('cep')} placeholder="00000-000" /></label>
              <label className="span2">Rua<input {...campo('rua')} /></label>
              <label>Número<input {...campo('numero')} /></label>
              <label>Complemento<input {...campo('complemento')} /></label>
              <label>Bairro<input {...campo('bairro')} /></label>
              <label>Cidade<input {...campo('cidade')} /></label>
              <label>UF
                <select {...campo('uf')}>
                  <option value="">--</option>
                  {UFS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </label>
            </div>
            {endereco.cep && !cepValido(endereco.cep) && <p className="erro" data-testid="erro-cep-checkout">CEP inválido.</p>}
          </fieldset>

          <fieldset data-testid="secao-pagamento">
            <legend>2. Pagamento</legend>
            <div className="abas">
              <label className={formaPagamento === 'cartao' ? 'ativa' : ''}>
                <input type="radio" name="pg" checked={formaPagamento === 'cartao'} onChange={() => setFormaPagamento('cartao')} data-testid="pagamento-cartao" />
                Cartão de crédito
              </label>
              <label className={formaPagamento === 'pix' ? 'ativa' : ''}>
                <input type="radio" name="pg" checked={formaPagamento === 'pix'} onChange={() => setFormaPagamento('pix')} data-testid="pagamento-pix" />
                PIX (5% de desconto)
              </label>
            </div>

            {formaPagamento === 'cartao' ? (
              <div className="grid-form">
                <label className="span2">Número do cartão
                  <input value={cartao.numero} onChange={(e) => setCartao({ ...cartao, numero: e.target.value })} placeholder="0000 0000 0000 0000" data-testid="cartao-numero" />
                </label>
                <label className="span2">Nome impresso
                  <input value={cartao.nome} onChange={(e) => setCartao({ ...cartao, nome: e.target.value })} data-testid="cartao-nome" />
                </label>
                <label>Validade (MM/AA)
                  <input value={cartao.validade} onChange={(e) => setCartao({ ...cartao, validade: e.target.value })} placeholder="MM/AA" data-testid="cartao-validade" />
                </label>
                <label>CVV
                  <input value={cartao.cvv} onChange={(e) => setCartao({ ...cartao, cvv: e.target.value })} maxLength={4} data-testid="cartao-cvv" />
                </label>
                <label className="span2">Parcelamento
                  <select value={parcelamento.parcelas} onChange={(e) => setParcelas(e.target.value)} data-testid="cartao-parcelas">
                    {opcoes.map((o) => (
                      <option key={o.parcelas} value={o.parcelas}>
                        {o.parcelas}x de {formatarMoeda(o.valorParcela)} sem juros
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <p className="pix-info" data-testid="pix-info">
                O QR Code PIX será exibido após a confirmação. Você economiza {formatarMoeda(resumo.descontoPix)}.
              </p>
            )}
          </fieldset>
        </div>

        <aside className="resumo" data-testid="resumo-checkout">
          <h2>Resumo</h2>
          <ul className="resumo__itens">
            {itens.map((i) => <li key={i.id}>{i.quantidade}× {i.nome}</li>)}
          </ul>
          <dl>
            <dt>Subtotal</dt><dd data-testid="checkout-subtotal">{formatarMoeda(resumo.subtotal)}</dd>
            {resumo.descontoCupom > 0 && (<><dt>Cupom {cupom.codigo}</dt><dd data-testid="checkout-desconto-cupom">− {formatarMoeda(resumo.descontoCupom)}</dd></>)}
            <dt>Frete</dt><dd data-testid="checkout-frete">{resumo.frete && resumo.frete.ok ? (resumo.valorFrete === 0 ? 'Grátis' : formatarMoeda(resumo.valorFrete)) : '—'}</dd>
            {resumo.descontoPix > 0 && (<><dt>Desconto PIX (5%)</dt><dd data-testid="checkout-desconto-pix">− {formatarMoeda(resumo.descontoPix)}</dd></>)}
            <dt className="total">Total</dt><dd className="total" data-testid="checkout-total">{formatarMoeda(resumo.total)}</dd>
          </dl>
          {erro && <p className="erro" data-testid="erro-checkout">{erro}</p>}
          <button
            className="botao botao--primario botao--bloco"
            disabled={!formValido}
            onClick={confirmar}
            data-testid="confirmar-pedido"
          >
            {enviando ? 'Processando pagamento...' : 'Confirmar pedido'}
          </button>
        </aside>
      </div>
    </section>
  );
}
