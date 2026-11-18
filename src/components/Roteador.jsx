import { useEffect, useState } from 'react';

// Roteamento simples baseado em hash (#/rota) — evita dependências extras no projeto de aula.
export function useRota() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const aoMudar = () => {
      setHash(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);
  const [caminho, query = ''] = hash.slice(1).split('?');
  return { caminho: caminho || '/', params: new URLSearchParams(query) };
}

export function navegar(caminho) {
  window.location.hash = caminho;
}

export function Link({ para, children, ...props }) {
  return (
    <a href={`#${para}`} {...props}>
      {children}
    </a>
  );
}
