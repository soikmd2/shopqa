// Regras de cadastro e login (US-06).

import { somenteDigitos } from './formatadores.js';

export const MAX_TENTATIVAS_LOGIN = 5;
export const MINUTOS_BLOQUEIO = 15;

export function emailValido(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Retorna a lista de regras de senha não atendidas (vazia = senha válida). */
export function problemasDaSenha(senha = '') {
  const problemas = [];
  if (senha.length < 8) problemas.push('mínimo de 8 caracteres');
  if (!/[A-Z]/.test(senha)) problemas.push('ao menos 1 letra maiúscula');
  if (!/\d/.test(senha)) problemas.push('ao menos 1 número');
  return problemas;
}

export function cpfValido(cpf = '') {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (fatia, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < fatia.length; i++) soma += Number(fatia[i]) * (pesoInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(d.slice(0, 9), 10) === Number(d[9]) && digito(d.slice(0, 10), 11) === Number(d[10]);
}

export function contaBloqueada(usuario, agora = Date.now()) {
  return Boolean(usuario.bloqueadoAte && usuario.bloqueadoAte > agora);
}

/**
 * Registra uma tentativa de login falha e devolve o usuário atualizado.
 */
export function registrarFalhaDeLogin(usuario, agora = Date.now()) {
  const tentativas = (usuario.tentativasFalhas || 0) + 1;
  const atualizado = { ...usuario, tentativasFalhas: tentativas };
  if (tentativas > MAX_TENTATIVAS_LOGIN) {
    atualizado.bloqueadoAte = agora + MINUTOS_BLOQUEIO * 60 * 1000;
    atualizado.tentativasFalhas = 0;
  }
  return atualizado;
}

export function registrarSucessoDeLogin(usuario) {
  return { ...usuario, tentativasFalhas: 0, bloqueadoAte: null };
}
