/**
 * Formulario para crear o editar una categoría.
 * Funciona igual que FormularioProducto: valida y entrega los datos al padre.
 */
import { useState } from 'react';
import { LIMITES } from '../../utils/constantes.js';
import { validarCategoria } from '../../utils/validaciones.js';
import CampoPanel from './CampoPanel.jsx';

/**
 * @param {Object} props
 * @param {Object|null} props.categoria - Categoría a editar o null para una nueva.
 * @param {boolean} props.guardando
 * @param {(datos: Object) => void} props.alGuardar
 * @param {() => void} props.alCancelar
 */
export default function FormularioCategoria({ categoria, guardando, alGuardar, alCancelar }) {
  const [valores, setValores] = useState(() => ({
    nombre: categoria?.nombre ?? '',
    descripcion: categoria?.descripcion ?? '',
    activo: categoria ? Boolean(categoria.activo) : true,
  }));
  const [errores, setErrores] = useState({});

  const manejarCambio = (evento) => {
    const { name, value, type, checked } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: type === 'checkbox' ? checked : value }));
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarCategoria(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    alGuardar({
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      activo: valores.activo,
    });
  };

  return (
    <section className="tarjeta">
      <h2>{categoria ? `Editar: ${categoria.nombre}` : 'Nueva categoría'}</h2>
      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        <CampoPanel
          etiqueta="Nombre *"
          ancho="span-5"
          name="nombre"
          value={valores.nombre}
          onChange={manejarCambio}
          error={errores.nombre}
          maxLength={LIMITES.nombreCategoria}
        />
        <CampoPanel
          etiqueta="Descripción"
          ancho="span-7"
          name="descripcion"
          value={valores.descripcion}
          onChange={manejarCambio}
          error={errores.descripcion}
          maxLength={LIMITES.descripcion}
        />
        <label className="casilla completo">
          <input type="checkbox" name="activo" checked={valores.activo} onChange={manejarCambio} />
          Categoría activa (se muestra en la tienda)
        </label>

        <div className="acciones">
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : categoria ? 'Actualizar categoría' : 'Guardar categoría'}
          </button>
          <button type="button" className="secundario" onClick={alCancelar} disabled={guardando}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
