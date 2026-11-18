#!/usr/bin/env node
// EXEMPLO 2 — PreToolUse (matcher: Write|Edit)
// Protege o "oráculo" e o "sistema sob teste". Mostra as TRÊS decisões possíveis via JSON:
//   deny  → requisitos/**, guardrails/**, .claude/settings*, .env*  (nunca)
//   deny  → src/**  em modo QA (padrão). Em modo dev (SHOPQA_MODO=dev) vira "ask".
//   ask   → package.json  (a pessoa usuária aprova ou recusa na hora)
//   (sem resposta) → todo o resto segue o fluxo normal de permissões
// Política fail-closed: se o hook quebrar, a escrita é bloqueada.

import {
  lerEntrada, raizDoProjeto, caminhoRelativo, decisaoPreToolUse, permitir, bloquear
} from './lib/entrada.js';

const PROTECOES = [
  { padrao: /^requisitos\//, decisao: 'deny', motivo: 'requisitos são o oráculo do teste — divergência vira pergunta ao PO ou bug, nunca edição do requisito' },
  { padrao: /^(guardrails\/|\.claude\/(settings(\.local)?\.json|hooks\/))/, decisao: 'deny', motivo: 'a IA não pode alterar os próprios guardrails' },
  { padrao: /(^|\/)\.env(\.|$)/, decisao: 'deny', motivo: 'arquivos .env contêm segredos' },
  { padrao: /^src\//, decisao: 'deny', decisaoDev: 'ask', motivo: 'em modo QA o código da aplicação é o sistema sob teste: registre o bug em qa/bugs/ em vez de corrigi-lo' },
  { padrao: /^package\.json$/, decisao: 'ask', motivo: 'mudança em dependências/scripts precisa de aprovação humana' }
];

try {
  const entrada = lerEntrada();
  const raiz = raizDoProjeto(entrada);
  const arquivo = entrada?.tool_input?.file_path || entrada?.tool_input?.notebook_path;
  if (!arquivo) permitir();

  const relativo = caminhoRelativo(arquivo, raiz);
  const modoDev = process.env.SHOPQA_MODO === 'dev';
  const regra = PROTECOES.find((p) => p.padrao.test(relativo));
  if (!regra) permitir();

  const decisao = modoDev && regra.decisaoDev ? regra.decisaoDev : regra.decisao;
  decisaoPreToolUse(
    decisao,
    `GUARDRAIL E2 — "${relativo}": ${regra.motivo}.` +
      (decisao === 'deny' && regra.decisaoDev ? ' (Para corrigir código, a pessoa usuária deve abrir a sessão com SHOPQA_MODO=dev.)' : '')
  );
} catch (erro) {
  bloquear(`🛑 GUARDRAIL E2 — falha interna (${erro.message}). Escrita bloqueada por segurança.`);
}
