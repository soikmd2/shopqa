import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O Vite entrega .md (e outros textos estáticos) como "text/markdown" sem charset, e o
// navegador cai no padrão Windows-1252: "Negócio" vira "NegÃ³cio". Este plugin acrescenta
// "; charset=utf-8" a toda resposta text/* que não declare charset.
function textoEmUtf8() {
  const comCharset = (value) =>
    typeof value === 'string' && value.startsWith('text/') && !/charset=/i.test(value)
      ? `${value}; charset=utf-8`
      : value;
  const middleware = (_req, res, next) => {
    // O Vite grava o tipo com setHeader; o sirv (arquivos estáticos) passa os cabeçalhos no writeHead.
    const setHeader = res.setHeader.bind(res);
    res.setHeader = (name, value) =>
      setHeader(name, String(name).toLowerCase() === 'content-type' ? comCharset(value) : value);
    const writeHead = res.writeHead.bind(res);
    res.writeHead = (status, ...resto) => {
      const headers = resto.find((r) => r && typeof r === 'object' && !Array.isArray(r));
      if (headers) {
        for (const k of Object.keys(headers)) {
          if (k.toLowerCase() === 'content-type') headers[k] = comCharset(headers[k]);
        }
      }
      return writeHead(status, ...resto);
    };
    next();
  };
  return {
    name: 'texto-em-utf8',
    // Corpo em bloco: se o hook retornar uma função, o Vite a trata como pós-hook e a chama.
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

export default defineConfig({
  plugins: [react(), textoEmUtf8()],
  server: { port: 5173, open: true }
});
