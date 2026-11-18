// Avaliações de produtos (US-02).

export const TAMANHO_MAXIMO_COMENTARIO = 500;

export function validarAvaliacao({ nota, comentario }) {
  const erros = [];
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) erros.push('Selecione uma nota de 1 a 5.');
  const texto = (comentario || '').trim();
  if (texto.length < 10) erros.push('O comentário deve ter ao menos 10 caracteres.');
  if (texto.length > TAMANHO_MAXIMO_COMENTARIO) erros.push(`O comentário deve ter no máximo ${TAMANHO_MAXIMO_COMENTARIO} caracteres.`);
  return erros;
}

// Permite destacar trechos com **negrito** (RN-06).
export function formatarComentario(texto) {
  return texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

export function mediaDasNotas(avaliacoes) {
  if (avaliacoes.length === 0) return 0;
  const soma = avaliacoes.reduce((s, a) => s + a.nota, 0);
  return Math.round((soma / avaliacoes.length) * 10) / 10;
}
