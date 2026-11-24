/**
 * Campo de los formularios de la tienda (registro, inicio de sesión, envío):
 * etiqueta, control y mensaje de error, con las clases .form-field de tienda.css.
 */
import { useId } from 'react';

/**
 * @param {Object} props
 * @param {string} props.etiqueta
 * @param {string} [props.error] - Mensaje de error del campo.
 * @param {string} [props.ayuda] - Texto de ayuda debajo del campo.
 * @param {'input'|'textarea'} [props.como='input']
 */
export default function CampoTienda({ etiqueta, error, ayuda, como = 'input', ...resto }) {
  const id = useId();
  const Control = como;

  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      <Control
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...resto}
      />
      {ayuda && !error && <small className="campo-ayuda">{ayuda}</small>}
      <span id={`${id}-error`} className="form-error" role={error ? 'alert' : undefined}>
        {error}
      </span>
    </div>
  );
}
