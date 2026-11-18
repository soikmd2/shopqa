import { useLoja } from '../context/LojaContext.jsx';

export default function Aviso() {
  const { aviso } = useLoja();
  if (!aviso) return null;
  return (
    <div className={`toast toast--${aviso.tipo}`} role="status" data-testid="toast">
      {aviso.texto}
    </div>
  );
}
