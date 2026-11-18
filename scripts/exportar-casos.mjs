// Gera versões legíveis (Markdown e CSV) dos casos de teste a partir do JSON.
// Uso: npm run casos:exportar  [arquivo.json]

import fs from 'node:fs';
import path from 'node:path';

const origem = process.argv[2] || 'qa/casos-de-teste/casos-de-teste.json';
const { projeto, casos } = JSON.parse(fs.readFileSync(origem, 'utf8'));
const base = origem.replace(/\.json$/, '');

const lista = (v) => (Array.isArray(v) ? v : []);
const dadosTexto = (d) => (d && Object.keys(d).length ? Object.entries(d).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ') : '—');

// ---------- Markdown ----------
const porHistoria = {};
for (const c of casos) (porHistoria[c.historia] ||= []).push(c);

let md = `# Casos de teste — ${projeto}\n\n> Gerado automaticamente a partir de \`${path.basename(origem)}\` (fonte de verdade). Não edite este arquivo à mão.\n\n`;
md += `**Total:** ${casos.length} casos · `;
const contar = (campo) => Object.entries(casos.reduce((a, c) => ({ ...a, [c[campo]]: (a[c[campo]] || 0) + 1 }), {})).map(([k, v]) => `${k}: ${v}`).join(', ');
md += `por prioridade — ${contar('prioridade')} · por tipo — ${contar('tipo')}\n\n`;
md += '| ID | Título | US / AC | Tipo | Prioridade |\n|----|--------|---------|------|------------|\n';
for (const c of casos) md += `| [${c.id}](#${c.id.toLowerCase()}) | ${c.titulo} | ${c.historia} / ${c.criterio} | ${c.tipo} | ${c.prioridade} |\n`;

for (const [us, cs] of Object.entries(porHistoria)) {
  md += `\n---\n\n## ${us}\n`;
  for (const c of cs) {
    md += `\n### ${c.id}\n**${c.titulo}**\n\n`;
    md += `- **Rastreabilidade:** ${c.historia} · ${c.criterio} · ${lista(c.regras).join(', ') || '—'}\n`;
    md += `- **Tipo / prioridade:** ${c.tipo} / ${c.prioridade} · automatizável: ${c.automatizavel ? 'sim' : 'não'}\n`;
    md += `- **Pré-condições:** ${lista(c.precondicoes).join('; ') || '—'}\n`;
    md += `- **Dados:** ${dadosTexto(c.dados)}\n\n`;
    md += '**Passos**\n' + lista(c.passos).map((p, i) => `${i + 1}. ${p}`).join('\n') + '\n\n';
    md += `**Resultado esperado:** ${c.resultadoEsperado}\n`;
  }
}
fs.writeFileSync(`${base}.md`, md);

// ---------- CSV (abre no Excel/Sheets; separador ;) ----------
const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const cab = ['id', 'titulo', 'historia', 'criterio', 'regras', 'tipo', 'prioridade', 'precondicoes', 'dados', 'passos', 'resultadoEsperado', 'automatizavel', 'status', 'evidencia'];
const linhas = casos.map((c) => [
  c.id, c.titulo, c.historia, c.criterio, lista(c.regras).join(', '), c.tipo, c.prioridade,
  lista(c.precondicoes).join(' | '), dadosTexto(c.dados), lista(c.passos).map((p, i) => `${i + 1}. ${p}`).join(' | '),
  c.resultadoEsperado, c.automatizavel ? 'sim' : 'não', '', ''
].map(esc).join(';'));
fs.writeFileSync(`${base}.csv`, '﻿' + [cab.join(';'), ...linhas].join('\n'));

console.log(`✔ ${casos.length} casos exportados para ${base}.md e ${base}.csv`);
