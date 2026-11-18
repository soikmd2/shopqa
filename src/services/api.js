// "Backend" simulado da ShopQA. Persiste tudo em localStorage e simula latência de rede.

import { PRODUTOS } from '../domain/produtos.js';
import {
  contaBloqueada,
  registrarFalhaDeLogin,
  registrarSucessoDeLogin
} from '../domain/autenticacao.js';
import { arredondar } from '../domain/formatadores.js';

const CHAVES = {
  usuarios: 'shopqa:usuarios',
  estoque: 'shopqa:estoque',
  pedidos: 'shopqa:pedidos',
  avaliacoes: 'shopqa:avaliacoes',
  sessao: 'shopqa:sessao'
};

export const LATENCIA_MS = 1200;

const esperar = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function ler(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// ---------- Seed de dados de demonstração ----------

const USUARIOS_SEED = [
  { id: 'u1', nome: 'Ana Cliente', email: 'cliente@shopqa.com', senha: 'Senha123', cpf: '529.982.247-25' },
  { id: 'u2', nome: 'Bruno Novo', email: 'novo@shopqa.com', senha: 'Senha123', cpf: '111.444.777-35' },
  { id: 'u3', nome: 'Carla Veterana', email: 'veterana@shopqa.com', senha: 'Senha123', cpf: '390.533.447-05' },
  { id: 'u4', nome: 'Diego Bloqueio', email: 'bloqueio@shopqa.com', senha: 'Senha123', cpf: '286.255.878-87' }
];

const PEDIDOS_SEED = [
  { id: 1001, usuarioId: 'u1', data: '2026-09-10T14:22:00', itens: [{ id: 4, nome: 'Mouse Óptico Sem Fio', preco: 89.9, quantidade: 1 }], total: 104.8, valorCobrado: 104.8, formaPagamento: 'pix', status: 'Entregue' },
  { id: 1002, usuarioId: 'u3', data: '2026-03-02T09:10:00', itens: [{ id: 9, nome: 'Bola de Futebol Oficial', preco: 149.9, quantidade: 1 }], total: 164.8, valorCobrado: 164.8, formaPagamento: 'cartao', parcelas: 1, status: 'Entregue' },
  { id: 1003, usuarioId: 'u3', data: '2026-06-18T19:45:00', itens: [{ id: 11, nome: 'Garrafa Térmica 1L', preco: 79.9, quantidade: 2 }], total: 174.7, valorCobrado: 174.7, formaPagamento: 'pix', status: 'Entregue' }
];

const AVALIACOES_SEED = [
  { id: 'a1', produtoId: 1, autor: 'Ana Cliente', nota: 5, comentario: 'Som **excelente** e bateria dura muito!', data: '2026-10-01T10:00:00' },
  { id: 'a2', produtoId: 1, autor: 'Carla Veterana', nota: 4, comentario: 'Muito bom, mas aperta um pouco depois de 2 horas.', data: '2026-10-12T18:30:00' },
  { id: 'a3', produtoId: 4, autor: 'Bruno Novo', nota: 3, comentario: 'Cumpre o que promete, nada além disso.', data: '2026-08-20T08:15:00' }
];

export function inicializarDados(forcar = false) {
  if (forcar || !localStorage.getItem(CHAVES.usuarios)) {
    gravar(CHAVES.usuarios, USUARIOS_SEED.map((u) => ({ ...u, tentativasFalhas: 0, bloqueadoAte: null })));
    gravar(CHAVES.pedidos, PEDIDOS_SEED);
    gravar(CHAVES.avaliacoes, AVALIACOES_SEED);
    gravar(CHAVES.estoque, Object.fromEntries(PRODUTOS.map((p) => [p.id, p.estoque])));
    localStorage.removeItem(CHAVES.sessao);
  }
}

export function resetarDadosDeDemo() {
  Object.values(CHAVES).forEach((c) => localStorage.removeItem(c));
  localStorage.removeItem('shopqa:carrinho');
  inicializarDados(true);
}

// ---------- Produtos ----------

export async function listarProdutos() {
  await esperar(250);
  const estoque = ler(CHAVES.estoque, {});
  return PRODUTOS.map((p) => ({ ...p, estoque: estoque[p.id] ?? p.estoque }));
}

export async function obterProduto(id) {
  const produtos = await listarProdutos();
  return produtos.find((p) => p.id === Number(id)) || null;
}

// ---------- Usuários / sessão ----------

function semSenha(usuario) {
  if (!usuario) return null;
  const { senha, ...resto } = usuario;
  const pedidos = ler(CHAVES.pedidos, []).filter((p) => p.usuarioId === usuario.id);
  return { ...resto, pedidos };
}

export function usuarioDaSessao() {
  const id = ler(CHAVES.sessao, null);
  if (!id) return null;
  return semSenha(ler(CHAVES.usuarios, []).find((u) => u.id === id));
}

export async function login(email, senha) {
  await esperar(500);
  const usuarios = ler(CHAVES.usuarios, []);
  const idx = usuarios.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) throw new Error('E-mail ou senha inválidos.');

  const usuario = usuarios[idx];
  if (contaBloqueada(usuario)) {
    throw new Error('Conta bloqueada temporariamente por excesso de tentativas. Tente novamente em 15 minutos.');
  }

  if (usuario.senha !== senha) {
    usuarios[idx] = registrarFalhaDeLogin(usuario);
    gravar(CHAVES.usuarios, usuarios);
    if (contaBloqueada(usuarios[idx])) {
      throw new Error('Conta bloqueada temporariamente por excesso de tentativas. Tente novamente em 15 minutos.');
    }
    throw new Error('E-mail ou senha inválidos.');
  }

  usuarios[idx] = registrarSucessoDeLogin(usuario);
  gravar(CHAVES.usuarios, usuarios);
  gravar(CHAVES.sessao, usuario.id);
  return semSenha(usuarios[idx]);
}

export function logout() {
  localStorage.removeItem(CHAVES.sessao);
}

export async function cadastrar({ nome, email, senha, cpf }) {
  await esperar(500);
  const usuarios = ler(CHAVES.usuarios, []);
  if (usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('Já existe uma conta com este e-mail.');
  }
  const novo = { id: `u${Date.now()}`, nome: nome.trim(), email: email.trim(), senha, cpf, tentativasFalhas: 0, bloqueadoAte: null };
  gravar(CHAVES.usuarios, [...usuarios, novo]);
  gravar(CHAVES.sessao, novo.id);
  return semSenha(novo);
}

// ---------- Pedidos ----------

export async function criarPedido({ usuario, itens, resumo, formaPagamento, parcelamento, endereco, cupom }) {
  await esperar(LATENCIA_MS);
  const estoque = ler(CHAVES.estoque, {});

  for (const item of itens) {
    const disponivel = estoque[item.id] ?? 0;
    if (item.quantidade > disponivel) {
      throw new Error(`Estoque insuficiente para "${item.nome}". Disponível: ${disponivel}.`);
    }
  }
  itens.forEach((item) => {
    estoque[item.id] = (estoque[item.id] ?? 0) - item.quantidade;
  });
  gravar(CHAVES.estoque, estoque);

  const pedidos = ler(CHAVES.pedidos, []);
  const valorCobrado =
    formaPagamento === 'cartao'
      ? arredondar(parcelamento.valorParcela * parcelamento.parcelas)
      : resumo.total;

  const pedido = {
    id: pedidos.reduce((max, p) => Math.max(max, p.id), 1000) + 1,
    usuarioId: usuario.id,
    data: new Date().toISOString(),
    itens: itens.map(({ id, nome, preco, quantidade }) => ({ id, nome, preco, quantidade })),
    subtotal: resumo.subtotal,
    descontoCupom: resumo.descontoCupom,
    cupom: cupom ? cupom.codigo : null,
    frete: resumo.valorFrete,
    descontoPix: resumo.descontoPix,
    total: resumo.total,
    valorCobrado,
    formaPagamento,
    parcelas: formaPagamento === 'cartao' ? parcelamento.parcelas : null,
    endereco,
    status: 'Aguardando envio'
  };
  gravar(CHAVES.pedidos, [...pedidos, pedido]);
  return pedido;
}

export async function listarPedidos(usuarioId) {
  await esperar(300);
  return ler(CHAVES.pedidos, [])
    .filter((p) => p.usuarioId === usuarioId)
    .sort((a, b) => b.data.localeCompare(a.data));
}

// ---------- Avaliações ----------

export async function listarAvaliacoes(produtoId) {
  await esperar(200);
  return ler(CHAVES.avaliacoes, [])
    .filter((a) => a.produtoId === Number(produtoId))
    .sort((a, b) => b.data.localeCompare(a.data));
}

export async function criarAvaliacao({ produtoId, usuario, nota, comentario }) {
  await esperar(400);
  const nova = {
    id: `a${Date.now()}`,
    produtoId: Number(produtoId),
    autor: usuario.nome,
    nota,
    comentario: comentario.trim(),
    data: new Date().toISOString()
  };
  gravar(CHAVES.avaliacoes, [...ler(CHAVES.avaliacoes, []), nova]);
  return nova;
}
