import { useState } from 'react';
import { useLoja } from '../context/LojaContext.jsx';
import { Link, navegar } from '../components/Roteador.jsx';
import { formatarMoeda } from '../domain/formatadores.js';
import { limiteDoItem } from '../domain/carrinho.js';
import { calcularResumo } from '../domain/resumo.js';
import { cepValido, formatarCep } from '../domain/frete.js';

export default function Carrinho() {
  const { itens, mudarQuantidade, remover, cupom, aplicarCupom, removerCupom, cep, setCep } = useLoja();
  const [codigo, setCodigo] = useState('');
  const [erroCupom, setErroCupom] = useState('');
  const [cepDigitado, setCepDigitado] = useState(cep);
  const [erroCep, setErroCep] = useState('');

  const resumo = calcularResumo({ itens, cupom, cep });

  if (itens.length === 0) {
    return (
      <section className="container vazio" data-testid="carrinho-vazio">
        <h1>Seu carrinho está vazio</h1>
        <Link para="/" className="botao botao--primario">Ver produtos</Link>
      </section>
    );
  }

  function onAplicarCupom(e) {
    e.preventDefault();
    const r = aplicarCupom(codigo);
    setErroCupom(r.ok ? '' : r.erro);
    if (r.ok) setCodigo('');
  }

  function onCalcularFrete(e) {
    e.preventDefault();
    if (!cepValido(cepDigitado)) {
      setErroCep('CEP inválido. Use o formato 00000-000.');
      return;
    }
    setErroCep('');
    setCep(cepDigitado);
  }

  return (
    <section className="container carrinho">
      <h1>Carrinho</h1>
      <div className="carrinho__layout">
        <div>
          <table className="tabela-itens" data-testid="tabela-carrinho">
            <thead>
              <tr><th>Produto</th><th>Preço</th><th>Quantidade</th><th>Total</th><th /></tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id} data-testid={`item-carrinho-${i.id}`}>
                  <td>{i.emoji} {i.nome}</td>
                  <td>{formatarMoeda(i.preco)}</td>
                  <td>
                    <div className="stepper">
                      <button onClick={() => mudarQuantidade(i.id, i.quantidade - 1)} data-testid={`diminuir-${i.id}`} aria-label="Diminuir">−</button>
                      <span data-testid={`quantidade-${i.id}`}>{i.quantidade}</span>
                      <button
                        onClick={() => mudarQuantidade(i.id, i.quantidade + 1)}
                        disabled={i.quantidade >= limiteDoItem(i.estoque)}
                        data-testid={`aumentar-${i.id}`}
                        aria-label="Aumentar"
                      >+</button>
                    </div>
                  </td>
                  <td data-testid={`total-item-${i.id}`}>{formatarMoeda(i.preco * i.quantidade)}</td>
                  <td><button className="link-botao" onClick={() => remover(i.id)} data-testid={`remover-${i.id}`}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="carrinho__forms">
            <form onSubmit={onAplicarCupom} data-testid="form-cupom">
              <label>Cupom de desconto</label>
              {cupom ? (
                <p className="cupom-aplicado" data-testid="cupom-aplicado">
                  <strong>{cupom.codigo}</strong> — {cupom.descricao}{' '}
                  <button type="button" className="link-botao" onClick={removerCupom} data-testid="remover-cupom">remover</button>
                </p>
              ) : (
                <div className="linha">
                  <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Digite o cupom" data-testid="campo-cupom" />
                  <button className="botao" data-testid="aplicar-cupom">Aplicar</button>
                </div>
              )}
              {erroCupom && <p className="erro" data-testid="erro-cupom">{erroCupom}</p>}
            </form>

            <form onSubmit={onCalcularFrete} data-testid="form-frete">
              <label>Calcular frete</label>
              <div className="linha">
                <input value={cepDigitado} onChange={(e) => setCepDigitado(formatarCep(e.target.value))} placeholder="00000-000" data-testid="campo-cep" />
                <button className="botao" data-testid="calcular-frete">Calcular</button>
              </div>
              {erroCep && <p className="erro" data-testid="erro-cep">{erroCep}</p>}
              {resumo.frete && resumo.frete.ok && (
                <p data-testid="resultado-frete">
                  {resumo.frete.regiao}: {resumo.frete.gratis ? <strong>Frete grátis</strong> : formatarMoeda(resumo.frete.valor)} · entrega em até {resumo.frete.prazo} dias úteis
                </p>
              )}
            </form>
          </div>
        </div>

        <aside className="resumo" data-testid="resumo-pedido">
          <h2>Resumo</h2>
          <dl>
            <dt>Subtotal</dt><dd data-testid="resumo-subtotal">{formatarMoeda(resumo.subtotal)}</dd>
            {resumo.descontoCupom > 0 && (<><dt>Desconto ({cupom.codigo})</dt><dd data-testid="resumo-desconto">− {formatarMoeda(resumo.descontoCupom)}</dd></>)}
            <dt>Frete</dt>
            <dd data-testid="resumo-frete">{resumo.frete ? (resumo.valorFrete === 0 ? 'Grátis' : formatarMoeda(resumo.valorFrete)) : 'Informe o CEP'}</dd>
            <dt className="total">Total</dt><dd className="total" data-testid="resumo-total">{formatarMoeda(resumo.total)}</dd>
          </dl>
          <button className="botao botao--primario botao--bloco" onClick={() => navegar('/checkout')} data-testid="ir-para-checkout">
            Finalizar compra
          </button>
          <Link para="/" className="continuar">Continuar comprando</Link>
        </aside>
      </div>
    </section>
  );
}
