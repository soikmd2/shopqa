#!/usr/bin/env node
// EXEMPLO 1 — PreToolUse (matcher: Bash)
// Guardrail determinístico: impede que o agente execute comandos destrutivos ou que vazem segredos.
// Política "fail-closed": se o próprio hook falhar, a ação é bloqueada (segurança > conveniência).

import { lerEntrada, bloquear, permitir } from './lib/entrada.js';

const REGRAS = [
  { padrao: /\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b/i, motivo: 'remoção recursiva forçada (rm -rf)', alternativa: 'remova arquivos específicos, um a um, e explique o porquê' },
  { padrao: /\bgit\s+push\b.*(--force\b|-f\b|--force-with-lease\b)/i, motivo: 'push forçado reescreve o histórico remoto', alternativa: 'faça um push normal ou abra um PR' },
  { padrao: /\bgit\s+reset\s+--hard\b/i, motivo: 'reset --hard descarta alterações não commitadas', alternativa: 'use git stash ou git restore em arquivos específicos' },
  { padrao: /\bgit\s+clean\s+-[a-z]*f/i, motivo: 'git clean -f apaga arquivos não rastreados', alternativa: 'liste com git clean -n e peça confirmação ao usuário' },
  { padrao: /\bnpm\s+publish\b/i, motivo: 'publicação de pacote não faz parte das tarefas de QA', alternativa: 'peça para a pessoa responsável publicar' },
  { padrao: /\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(sh|bash|zsh|node|python)/i, motivo: 'executar script baixado da internet sem revisão', alternativa: 'baixe o arquivo, mostre o conteúdo e peça aprovação' },
  { padrao: /\bchmod\s+(-R\s+)?777\b/i, motivo: 'permissão 777 abre o arquivo para qualquer usuário', alternativa: 'use permissões mínimas (ex.: 644/755)' },
  { padrao: /(^|[\s;&|])(cat|less|more|head|tail|type)\s+[^\n]*\.env(\s|$|\.(local|prod|production|dev)\b)/i, motivo: 'leitura de arquivo de segredos (.env)', alternativa: 'use .env.example ou peça o valor específico à pessoa usuária' },
  { padrao: /\b(drop\s+(table|database)|truncate\s+table)\b/i, motivo: 'comando SQL destrutivo', alternativa: 'use um banco descartável e peça confirmação' }
];

try {
  const entrada = lerEntrada();
  const comando = entrada?.tool_input?.command || '';

  const violada = REGRAS.find((r) => r.padrao.test(comando));
  if (violada) {
    bloquear(
      `🛑 GUARDRAIL E1 — comando bloqueado: ${violada.motivo}.\n` +
      `Comando: ${comando}\n` +
      `Alternativa segura: ${violada.alternativa}.`
    );
  }
  permitir();
} catch (erro) {
  bloquear(`🛑 GUARDRAIL E1 — falha interna ao avaliar o comando (${erro.message}). Por segurança, a ação foi bloqueada.`);
}
