// Suíte de regressão das regras de negócio (camada de domínio).
// Rode com:  npm run test:regras
// Todos estes testes PASSAM na v1.4 — eles são a "rede de segurança" usada nas aulas
// de análise de risco (PRs em mudancas/) e pelos hooks de guardrail.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { PRODUTOS } from '../../src/domain/produtos.js';
import { buscarProdutos, filtrarPorCategoria, ordenarProdutos } from '../../src/domain/busca.js';
import { adicionarItem, alterarQuantidade, calcularSubtotal, contarItens } from '../../src/domain/carrinho.js';
import { validarCupom, calcularDescontoCupom } from '../../src/domain/cupons.js';
import { calcularFrete, cepValido } from '../../src/domain/frete.js';
import { numeroCartaoValido, validadeCartaoValida, cvvValido, opcoesDeParcelamento } from '../../src/domain/pagamento.js';
import { cpfValido, problemasDaSenha, emailValido } from '../../src/domain/autenticacao.js';
import { validarAvaliacao, mediaDasNotas } from '../../src/domain/avaliacoes.js';
import { calcularResumo } from '../../src/domain/resumo.js';
import { formatarMoeda, rotuloQuantidadeItens } from '../../src/domain/formatadores.js';

const produto = (id) => PRODUTOS.find((p) => p.id === id);
const HOJE = new Date(2026, 10, 17); // 17/11/2026 — datas fixas deixam os testes determinísticos

describe('US-01 Catálogo', () => {
  test('RN-01 busca pelo nome exato', () => {
    assert.deepEqual(buscarProdutos(PRODUTOS, 'Fone Bluetooth Pro').map((p) => p.id), [1]);
  });
  test('RN-01 busca ignora acentos', () => {
    assert.deepEqual(buscarProdutos(PRODUTOS, 'Luminaria').map((p) => p.id), [8]);
  });
  test('RN-01 termo vazio ou só espaços retorna o catálogo inteiro', () => {
    assert.equal(buscarProdutos(PRODUTOS, '   ').length, PRODUTOS.length);
  });
  test('RN-02 ordenação padrão é por mais vendidos', () => {
    assert.equal(ordenarProdutos(PRODUTOS)[0].nome, 'Garrafa Térmica 1L');
  });
  test('RN-02 menor preço', () => {
    assert.equal(ordenarProdutos(PRODUTOS, 'menor-preco')[0].preco, 59.9);
  });
  test('filtro por categoria', () => {
    assert.ok(filtrarPorCategoria(PRODUTOS, 'Livros').every((p) => p.categoria === 'Livros'));
  });
  test('RN-03 singular e plural (1 e N)', () => {
    assert.equal(rotuloQuantidadeItens(1), '1 item');
    assert.equal(rotuloQuantidadeItens(3), '3 itens');
  });
});

describe('US-03 Carrinho', () => {
  test('RN-04 produto esgotado não entra no carrinho', () => {
    const r = adicionarItem([], produto(13));
    assert.equal(r.erro, 'Produto esgotado.');
    assert.equal(r.itens.length, 0);
  });
  test('RN-08 primeira inclusão respeita o limite de 10', () => {
    const { itens } = adicionarItem([], produto(4), 15);
    assert.equal(itens[0].quantidade, 10);
  });
  test('RN-08 primeira inclusão respeita o estoque', () => {
    const { itens } = adicionarItem([], produto(10), 5); // Tênis, estoque 3
    assert.equal(itens[0].quantidade, 3);
  });
  test('RN-08 botão + não passa do limite', () => {
    let { itens } = adicionarItem([], produto(10), 3);
    itens = alterarQuantidade(itens, 10, 4);
    assert.equal(itens[0].quantidade, 3);
  });
  test('RN-09 quantidade 0 remove o item', () => {
    let { itens } = adicionarItem([], produto(4));
    itens = alterarQuantidade(itens, 4, 0);
    assert.equal(itens.length, 0);
  });
  test('subtotal e contagem', () => {
    let { itens } = adicionarItem([], produto(4), 2);
    itens = adicionarItem(itens, produto(12)).itens;
    assert.equal(calcularSubtotal(itens), 239.7);
    assert.equal(contarItens(itens), 3);
  });
});

describe('US-04 Cupons', () => {
  test('RN-12 código sem diferenciar maiúsculas e com espaços', () => {
    assert.equal(validarCupom('  qa15 ', { subtotal: 100, hoje: HOJE }).ok, true);
  });
  test('cupom inexistente', () => {
    assert.equal(validarCupom('NAOEXISTE', { subtotal: 100, hoje: HOJE }).erro, 'Cupom inválido.');
  });
  test('RN-13 VERAO10 encerrado é recusado', () => {
    assert.equal(validarCupom('VERAO10', { subtotal: 100, hoje: HOJE }).erro, 'Cupom expirado.');
  });
  test('BLACK50 abaixo do mínimo ao aplicar', () => {
    assert.match(validarCupom('BLACK50', { subtotal: 149.9, hoje: HOJE }).erro, /R\$ 300,00/);
  });
  test('RN-15 PRIMEIRACOMPRA exige login', () => {
    assert.equal(validarCupom('PRIMEIRACOMPRA', { subtotal: 100, usuario: null, hoje: HOJE }).erro, 'Faça login para usar este cupom.');
  });
  test('RN-15 PRIMEIRACOMPRA aceito sem pedidos', () => {
    assert.equal(validarCupom('PRIMEIRACOMPRA', { subtotal: 100, usuario: { pedidos: [] }, hoje: HOJE }).ok, true);
  });
  test('RN-15 PRIMEIRACOMPRA recusado com 2 pedidos', () => {
    assert.equal(validarCupom('PRIMEIRACOMPRA', { subtotal: 100, usuario: { pedidos: [{}, {}] }, hoje: HOJE }).ok, false);
  });
  test('RN-16 desconto fixo nunca maior que o subtotal', () => {
    assert.equal(calcularDescontoCupom({ tipo: 'fixo', valor: 50 }, 30), 30);
  });
});

describe('US-05 Frete', () => {
  test('RN-17 CEP com e sem hífen', () => {
    assert.equal(cepValido('01310-100'), true);
    assert.equal(cepValido('90010000'), true);
    assert.equal(cepValido('0131A-100'), false);
  });
  test('RN-18 tabela por região', () => {
    assert.equal(calcularFrete('01310-100', 100).valor, 14.9);
    assert.equal(calcularFrete('90010-000', 100).valor, 22.9);
    assert.equal(calcularFrete('40010-000', 100).prazo, 6);
  });
  test('RN-19 frete grátis acima de R$ 299,00', () => {
    assert.equal(calcularFrete('01310-100', 299.01).valor, 0);
  });
  test('RN-19 cupom FRETEGRATIS zera o frete', () => {
    assert.equal(calcularFrete('01310-100', 160, { tipo: 'frete' }).valor, 0);
  });
});

describe('US-07 Pagamento e resumo', () => {
  test('RN-23 Luhn', () => {
    assert.equal(numeroCartaoValido('4111 1111 1111 1111'), true);
    assert.equal(numeroCartaoValido('4111 1111 1111 1112'), false);
  });
  test('RN-23 validade e CVV', () => {
    assert.equal(validadeCartaoValida('12/30', HOJE), true);
    assert.equal(validadeCartaoValida('10/26', HOJE), false);
    assert.equal(cvvValido('12'), false);
  });
  test('RN-22 até 10x com parcela mínima de R$ 20,00', () => {
    assert.equal(opcoesDeParcelamento(4299).length, 10);
    assert.equal(opcoesDeParcelamento(59.9).length, 2); // 1x e 2x de 29,95
  });
  test('RN-20 resumo no cartão: subtotal + frete', () => {
    const itens = [{ id: 9, preco: 149.9, quantidade: 1 }];
    const r = calcularResumo({ itens, cep: '01310-100', formaPagamento: 'cartao' });
    assert.equal(r.total, 164.8);
  });
  test('RN-20 cupom percentual entra antes do frete', () => {
    const itens = [{ id: 3, preco: 4299, quantidade: 1 }];
    const r = calcularResumo({ itens, cupom: { tipo: 'percentual', valor: 15 }, cep: '01310-100' });
    assert.equal(r.descontoCupom, 644.85);
    assert.equal(r.valorFrete, 0);
    assert.equal(r.total, 3654.15);
  });
});

describe('US-06 Conta', () => {
  test('RN-27 regras de senha', () => {
    assert.deepEqual(problemasDaSenha('Senha123'), []);
    assert.ok(problemasDaSenha('senha123').includes('ao menos 1 letra maiúscula'));
  });
  test('RN-29 CPF', () => {
    assert.equal(cpfValido('529.982.247-25'), true);
    assert.equal(cpfValido('111.111.111-11'), false);
  });
  test('e-mail', () => {
    assert.equal(emailValido('ana@shopqa.com'), true);
    assert.equal(emailValido('ana@shopqa'), false);
  });
});

describe('US-02 Avaliações', () => {
  test('RN-05 comentário curto é rejeitado', () => {
    assert.ok(validarAvaliacao({ nota: 5, comentario: 'curto' }).length > 0);
  });
  test('RN-07 média com 1 casa', () => {
    assert.equal(mediaDasNotas([{ nota: 5 }, { nota: 4 }, { nota: 4 }]), 4.3);
  });
});

describe('Formatação', () => {
  test('RN-10 moeda brasileira', () => {
    assert.equal(formatarMoeda(1299.9).replace(/\s/g, ' '), 'R$ 1.299,90');
  });
});
