#!/usr/bin/env node
// EXEMPLO 3 — PostToolUse (matcher: Write|Edit)
// Valida a QUALIDADE ESTRUTURAL dos casos de teste gerados pela IA (schema em guardrails/schemas/).
// Como a ferramenta já executou, o exit 2 não desfaz a escrita: ele devolve os erros ao Claude,
// que entra num ciclo "gera → valida → corrige" até o arquivo passar.

import fs from 'node:fs';
import path from 'node:path';
import { lerEntrada, raizDoProjeto, caminhoRelativo, bloquear, permitir } from './lib/entrada.js';

const ALVO = /casos-de-teste\/[^/]+\.json$/;
const TIPOS = ['funcional', 'negativo', 'limite', 'seguranca', 'usabilidade', 'desempenho', 'acessibilidade', 'regressao'];
const PRIORIDADES = ['critica', 'alta', 'media', 'baixa'];

// Resultados esperados que não podem ser verificados objetivamente.
const FRASES_VAGAS = [
  /funcion(ar|e|a) (corretamente|normalmente|bem)/i,
  /conforme (o )?esperado/i,
  /comportamento (esperado|adequado|correto)/i,
  /^\s*(ok|sucesso|passou|deve funcionar)\.?\s*$/i,
  /sem (erros|problemas)\.?\s*$/i
];

export function validarCasos(documento) {
  const erros = [];
  if (!documento || !Array.isArray(documento.casos)) {
    return ['O arquivo deve ser um objeto com a propriedade "casos" (array).'];
  }
  const ids = new Set();

  documento.casos.forEach((c, i) => {
    const ref = c && c.id ? c.id : `casos[${i}]`;
    const erro = (msg) => erros.push(`${ref}: ${msg}`);

    if (!/^TC-[A-Z]{3}-\d{3}$/.test(c.id || '')) erro('"id" deve seguir o padrão TC-AAA-000 (ex.: TC-CUP-011).');
    else if (ids.has(c.id)) erro('"id" duplicado.');
    ids.add(c.id);

    if (!c.titulo || c.titulo.trim().length < 10) erro('"titulo" deve ter ao menos 10 caracteres e descrever o objetivo.');
    if (!/^US-\d{2}$/.test(c.historia || '')) erro('"historia" deve referenciar uma user story (ex.: US-04).');
    if (!/^AC-\d{2}\.\d+$/.test(c.criterio || '')) erro('"criterio" deve referenciar um critério de aceite (ex.: AC-04.5).');
    else if (c.historia && c.criterio.slice(3, 5) !== c.historia.slice(3, 5)) erro(`"criterio" ${c.criterio} não pertence à história ${c.historia}.`);
    if (!Array.isArray(c.regras)) erro('"regras" deve ser uma lista de IDs RN-XX (pode ser vazia).');
    if (!TIPOS.includes(c.tipo)) erro(`"tipo" deve ser um de: ${TIPOS.join(', ')}.`);
    if (!PRIORIDADES.includes(c.prioridade)) erro(`"prioridade" deve ser uma de: ${PRIORIDADES.join(', ')}.`);
    if (!Array.isArray(c.precondicoes)) erro('"precondicoes" deve ser uma lista (pode ser vazia).');
    if (!Array.isArray(c.passos) || c.passos.length === 0 || c.passos.some((p) => typeof p !== 'string' || !p.trim())) {
      erro('"passos" deve ser uma lista não vazia de textos.');
    }
    const esperado = (c.resultadoEsperado || '').trim();
    if (esperado.length < 15) erro('"resultadoEsperado" deve ter ao menos 15 caracteres.');
    else if (FRASES_VAGAS.some((r) => r.test(esperado))) {
      erro(`"resultadoEsperado" é vago ("${esperado.slice(0, 60)}"). Descreva o que é observável: mensagens exatas, valores, estados de tela.`);
    }
    if (typeof c.automatizavel !== 'boolean') erro('"automatizavel" deve ser true ou false.');
  });

  return erros;
}

// Executa como hook somente quando chamado diretamente (permite importar validarCasos em testes).
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('e3-validar-casos-de-teste.js')) {
  try {
    const entrada = lerEntrada();
    const raiz = raizDoProjeto(entrada);
    const arquivo = entrada?.tool_input?.file_path;
    if (!arquivo) permitir();

    const relativo = caminhoRelativo(arquivo, raiz);
    if (!ALVO.test(relativo)) permitir();

    let documento;
    try {
      documento = JSON.parse(fs.readFileSync(path.resolve(raiz, arquivo), 'utf8'));
    } catch (e) {
      bloquear(`❌ GUARDRAIL E3 — "${relativo}" não é um JSON válido: ${e.message}. Corrija a sintaxe.`);
    }

    const erros = validarCasos(documento);
    if (erros.length) {
      const lista = erros.slice(0, 20).map((e) => `  • ${e}`).join('\n');
      const extra = erros.length > 20 ? `\n  … e mais ${erros.length - 20} problema(s).` : '';
      bloquear(
        `❌ GUARDRAIL E3 — ${erros.length} problema(s) nos casos de teste de "${relativo}":\n${lista}${extra}\n` +
        'Corrija o arquivo e salve novamente. Schema: guardrails/schemas/caso-de-teste.schema.json'
      );
    }
    permitir();
  } catch (erro) {
    // Validação de qualidade é "fail-open": um erro interno não deve travar o trabalho.
    process.stderr.write(`Aviso E3: validação não executada (${erro.message}).\n`);
    process.exit(1);
  }
}
