/**
 * Ventana de confirmación del panel (por ejemplo, antes de eliminar).
 * Usa el elemento nativo <dialog> con showModal(): el navegador se encarga de
 * bloquear el fondo, de mover el foco adentro y de cerrar con la tecla Escape.
 */
import { useEffect, useId, useRef } from 'react';

/**
 * @param {Object} props
 * @param {boolean} props.abierto
 * @param {string} props.titulo
 * @param {React.ReactNode} props.children - Texto de la pregunta.
 * @param {string} [props.textoConfirmar='Eliminar']
 * @param {boolean} [props.procesando=false] - Deshabilita los botones mientras responde la API.
 * @param {() => void} props.alConfirmar
 * @param {() => void} props.alCancelar
 */
export default function ModalConfirmacion({
  abierto,
  titulo,
  children,
  textoConfirmar = 'Eliminar',
  procesando = false,
  alConfirmar,
  alCancelar,
}) {
  const dialogo = useRef(null);
  const idTitulo = useId();

  // Sincroniza la prop "abierto" con el <dialog> del navegador
  useEffect(() => {
    const elemento = dialogo.current;
    if (abierto && !elemento.open) elemento.showModal();
    if (!abierto && elemento.open) elemento.close();
  }, [abierto]);

  /** Escape dispara el evento "cancel": se avisa al padre en lugar de cerrar solo. */
  const manejarCancelar = (evento) => {
    evento.preventDefault();
    if (!procesando) alCancelar();
  };

  return (
    <dialog
      ref={dialogo}
      className="confirmacion"
      aria-labelledby={idTitulo}
      onCancel={manejarCancelar}
    >
      <div className="confirmacion-icono" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" />
        </svg>
      </div>
      <h2 id={idTitulo}>{titulo}</h2>
      <p>{children}</p>
      <div className="confirmacion-botones">
        <button
          type="button"
          className="secundario"
          onClick={alCancelar}
          disabled={procesando}
          autoFocus
        >
          Cancelar
        </button>
        <button
          type="button"
          className="peligro-solido"
          onClick={alConfirmar}
          disabled={procesando}
        >
          {procesando ? 'Eliminando...' : textoConfirmar}
        </button>
      </div>
    </dialog>
  );
}
