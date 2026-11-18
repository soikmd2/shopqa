#!/usr/bin/env node
// Volta o projeto ao estado inicial da aula: desfaz o que a turma (ou a IA) alterou nas pastas
// do curso, apaga a trilha de auditoria do E5 e derruba a loja em segundo plano.
//
//   npm run aula:resetar                                   → só mostra o que seria desfeito
//   npm run aula:resetar -- --confirmar                    → desfaz
//   npm run aula:resetar -- --confirmar --sem-guardrails   → também remove .claude/settings.json
//
// "Estado inicial" = o último commit (HEAD). O que já foi commitado não é tocado.
// Nunca mexe em professor/, node_modules/ nem em arquivos fora das pastas do curso.
// Os dados da loja ficam no navegador: use o rodapé → "Restaurar dados de demonstração".

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(raiz);

const args = new Set(process.argv.slice(2));
const confirmar = args.has('--confirmar');
const semGuardrails = args.has('--sem-guardrails');

const PASTAS = ['src', 'requisitos', 'qa', 'mudancas', 'desafios', 'tests', 'prompts', 'guardrails'];
const LOGS = path.join('.claude', 'logs');
const SETTINGS = path.join('.claude', 'settings.json');
const SERVIDOR = '.shopqa-dev.json';

const git = (...a) => execFileSync('git', a, { encoding: 'utf8' });
const listaZ = (saida) => saida.split('\0').filter(Boolean);

// Arquivos versionados com diferença em relação ao HEAD (staged ou não). Sem detecção de renomeação,
// um arquivo renomeado aparece como apagado (volta) + novo (é removido).
const alterados = listaZ(git('diff', '--name-only', '-z', '--no-renames', '--diff-filter=MDT', 'HEAD', '--', ...PASTAS));
// Arquivos novos: os adicionados ao índice e os não rastreados (o .gitignore protege node_modules etc.).
const novos = [
  ...listaZ(git('diff', '--name-only', '-z', '--no-renames', '--diff-filter=A', 'HEAD', '--', ...PASTAS)),
  ...listaZ(git('ls-files', '--others', '--exclude-standard', '-z', '--', ...PASTAS))
];
const logs = fs.existsSync(LOGS) ? fs.readdirSync(LOGS).map((f) => path.join(LOGS, f)) : [];
const backups = fs.existsSync('.claude')
  ? fs.readdirSync('.claude').filter((f) => f.startsWith('settings.json.backup-')).map((f) => path.join('.claude', f))
  : [];
let servidor = null;
try {
  const { pid, url } = JSON.parse(fs.readFileSync(SERVIDOR, 'utf8'));
  process.kill(pid, 0);
  servidor = { pid, url };
} catch { /* não está rodando */ }
const removerSettings = semGuardrails && fs.existsSync(SETTINGS);

const secoes = [
  ['Alterações em arquivos do curso (voltam ao último commit)', alterados],
  ['Arquivos novos nas pastas do curso (serão apagados)', novos],
  ['Trilha de auditoria do E5 (será apagada)', logs],
  ...(semGuardrails ? [['Guardrails instalados (serão removidos)', [...(removerSettings ? [SETTINGS] : []), ...backups]]] : []),
  ['Loja em segundo plano (será derrubada)', servidor ? [`${servidor.url} (PID ${servidor.pid})`] : []]
];

const total = secoes.reduce((n, [, itens]) => n + itens.length, 0);
if (total === 0) {
  console.log('✔ Nada a desfazer: o projeto já está no estado inicial da aula.');
  if (!semGuardrails && fs.existsSync(SETTINGS)) console.log('  (guardrails seguem instalados; use --sem-guardrails para removê-los)');
  process.exit(0);
}

console.log(confirmar ? 'Desfazendo:\n' : 'Simulação: nada foi alterado. O que seria desfeito:\n');
for (const [titulo, itens] of secoes) {
  if (!itens.length) continue;
  console.log(`${titulo}:`);
  for (const item of itens) console.log(`  - ${item}`);
}

if (!confirmar) {
  console.log('\nPara desfazer de verdade: npm run aula:resetar -- --confirmar');
  if (!semGuardrails && fs.existsSync(SETTINGS)) {
    console.log('Para também remover os guardrails: npm run aula:resetar -- --confirmar --sem-guardrails');
  }
  process.exit(0);
}

// Apaga o arquivo e as pastas que ficarem vazias, sem subir além da pasta do curso.
const apagar = (arquivo) => {
  fs.rmSync(arquivo, { force: true });
  let dir = path.dirname(arquivo);
  while (!PASTAS.includes(dir) && dir !== '.' && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
};

if (alterados.length) git('restore', '--source=HEAD', '--staged', '--worktree', '--', ...alterados);
if (novos.length) {
  git('rm', '--cached', '--quiet', '--ignore-unmatch', '--', ...novos); // tira do índice os que foram adicionados
  novos.forEach(apagar);
}
logs.forEach((f) => fs.rmSync(f, { force: true, recursive: true }));
if (semGuardrails) [...(removerSettings ? [SETTINGS] : []), ...backups].forEach((f) => fs.rmSync(f, { force: true }));
if (servidor) spawnSync(process.execPath, ['scripts/servidor.mjs', 'parar'], { stdio: 'inherit' });

console.log(`\n✔ Projeto de volta ao estado inicial da aula (${total} ${total === 1 ? 'item' : 'itens'}).`);
console.log('  Dados da loja no navegador: rodapé → "Restaurar dados de demonstração".');
if (fs.existsSync(SETTINGS)) {
  console.log('  Guardrails continuam instalados. Se o Claude Code estiver aberto, a trilha do E5 recomeça na próxima ação.');
}
