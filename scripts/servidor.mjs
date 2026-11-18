// Sobe ou derruba o servidor de desenvolvimento (Vite) em segundo plano.
// Uso: npm run dev:bg    → inicia e libera o terminal
//      npm run dev:stop  → encerra
// Saída do servidor: .shopqa-dev.log · controle do processo: .shopqa-dev.json

import fs from 'node:fs';
import { spawn, execSync } from 'node:child_process';

const ESTADO = '.shopqa-dev.json';
const LOG = '.shopqa-dev.log';
const VITE = 'node_modules/vite/bin/vite.js';

const vivo = (pid) => {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
};
const lerEstado = () => {
  try { return JSON.parse(fs.readFileSync(ESTADO, 'utf8')); } catch { return null; }
};
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function iniciar() {
  const atual = lerEstado();
  if (atual && vivo(atual.pid)) {
    console.log(`ShopQA já está rodando em ${atual.url} (PID ${atual.pid}).`);
    console.log('Para parar: npm run dev:stop');
    return;
  }
  if (!fs.existsSync(VITE)) {
    console.error('Dependências não instaladas. Rode "npm install" primeiro.');
    process.exit(1);
  }

  const saida = fs.openSync(LOG, 'w');
  const filho = spawn(process.execPath, [VITE], {
    detached: true,
    stdio: ['ignore', saida, saida],
    windowsHide: true,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }
  });
  filho.unref();

  // Espera o Vite anunciar o endereço (a porta pode mudar se 5173 estiver ocupada).
  for (let i = 0; i < 60; i++) {
    await esperar(250);
    const log = fs.readFileSync(LOG, 'utf8');
    const url = log.match(/Local:\s+(http\S+)/)?.[1];
    if (url) {
      fs.writeFileSync(ESTADO, JSON.stringify({ pid: filho.pid, url }, null, 2));
      console.log(`ShopQA rodando em segundo plano em ${url} (PID ${filho.pid}).`);
      console.log(`Log: ${LOG} · Para parar: npm run dev:stop`);
      return;
    }
    if (!vivo(filho.pid)) break;
  }

  console.error(`O servidor não subiu. Últimas linhas de ${LOG}:\n`);
  console.error(fs.readFileSync(LOG, 'utf8').split('\n').slice(-15).join('\n'));
  if (vivo(filho.pid)) encerrar(filho.pid);
  process.exit(1);
}

function encerrar(pid) {
  if (process.platform === 'win32') {
    execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
  } else {
    process.kill(-pid, 'SIGTERM'); // grupo inteiro: Vite e seus subprocessos (esbuild)
  }
}

async function parar() {
  const atual = lerEstado();
  if (!atual || !vivo(atual.pid)) {
    fs.rmSync(ESTADO, { force: true });
    console.log('ShopQA não está rodando em segundo plano.');
    return;
  }
  encerrar(atual.pid);
  for (let i = 0; i < 20 && vivo(atual.pid); i++) await esperar(250);
  fs.rmSync(ESTADO, { force: true });
  console.log(`ShopQA parado (PID ${atual.pid}).`);
}

const comando = process.argv[2];
if (comando === 'iniciar') await iniciar();
else if (comando === 'parar') await parar();
else {
  console.error('Uso: node scripts/servidor.mjs iniciar|parar');
  process.exit(1);
}
