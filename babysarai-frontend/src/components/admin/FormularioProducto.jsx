/**
 * Formulario para crear o editar un producto (diseño del panel: 12 columnas).
 * Si recibe "producto" está en modo edición; si es null, en modo creación.
 * No llama a la API: valida y entrega los datos limpios al padre con alGuardar().
 */
import { useState } from 'react';
import { ESTADOS_PRODUCTO, LIMITES, TALLAS_SUGERIDAS } from '../../utils/constantes.js';
import { validarProducto } from '../../utils/validaciones.js';
import CampoPanel from './CampoPanel.jsx';

/** Valores del formulario vacío. */
const FORMULARIO_VACIO = {
  nombre: '',
  categoriaId: '',
  precio: '',
  talla: '',
  estado: 'nuevo',
  stock: '0',
  descripcion: '',
  activo: true,
};

/**
 * Convierte un producto de la API en valores para los campos del formulario.
 * @param {Object|null} producto
 * @returns {Object}
 */
function aValoresFormulario(producto) {
  if (!producto) return FORMULARIO_VACIO;
  return {
    nombre: producto.nombre,
    categoriaId: String(producto.categoriaId),
    precio: String(Number(producto.precio)),
    talla: producto.talla ?? '',
    estado: producto.estado,
    stock: String(producto.stock),
    descripcion: producto.descripcion ?? '',
    activo: Boolean(producto.activo),
  };
}

/**
 * @param {Object} props
 * @param {Object|null} props.producto - Producto a editar o null para uno nuevo.
 * @param {Object[]} props.categorias - Opciones del selector de categoría.
 * @param {boolean} props.guardando - true mientras la API responde.
 * @param {(datos: Object) => void} props.alGuardar
 * @param {() => void} props.alCancelar
 */
export default function FormularioProducto({
  producto,
  categorias,
  guardando,
  alGuardar,
  alCancelar,
}) {
  // El padre cambia la "key" de este componente al elegir otro producto,
  // así el estado inicial se vuelve a calcular sin necesidad de useEffect.
  const [valores, setValores] = useState(() => aValoresFormulario(producto));
  const [errores, setErrores] = useState({});

  /** Actualiza el campo que cambió (según su atributo name) y borra su error. */
  const manejarCambio = (evento) => {
    const { name, value, type, checked } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: type === 'checkbox' ? checked : value }));
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
  };

  /** Valida y, si todo está bien, entrega los datos con el tipo correcto. */
  const manejarEnvio = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarProducto(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    alGuardar({
      nombre: valores.nombre.trim(),
      categoriaId: Number(valores.categoriaId),
      precio: Number(valores.precio),
      talla: valores.talla.trim(),
      estado: valores.estado,
      stock: Number(valores.stock),
      descripcion: valores.descripcion.trim(),
      activo: valores.activo,
    });
  };

  return (
    <section className="tarjeta">
      <h2>{producto ? `Editar: ${producto.nombre}` : 'Nuevo producto'}</h2>

      {/* noValidate: la validación la hace React (y luego el servidor), no el navegador */}
      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        <CampoPanel
          etiqueta="Nombre *"
          ancho="span-5"
          name="nombre"
          value={valores.nombre}
          onChange={manejarCambio}
          error={errores.nombre}
          maxLength={LIMITES.nombreProducto}
        />
        <CampoPanel
          etiqueta="Categoría *"
          ancho="span-4"
          como="select"
          name="categoriaId"
          value={valores.categoriaId}
          onChange={manejarCambio}
          error={errores.categoriaId}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
              {!categoria.activo && ' (inactiva)'}
            </option>
          ))}
        </CampoPanel>
        <CampoPanel
          etiqueta="Precio (COP) *"
          ancho="span-3"
          type="number"
          name="precio"
          min="0"
          step="100"
          value={valores.precio}
          onChange={manejarCambio}
          error={errores.precio}
        />
        <CampoPanel
          etiqueta="Talla"
          ancho="span-4"
          name="talla"
          list="tallas-sugeridas"
          placeholder="Ej: 0-3M"
          value={valores.talla}
          onChange={manejarCambio}
          error={errores.talla}
          maxLength={LIMITES.talla}
        />
        <CampoPanel
          etiqueta="Estado"
          ancho="span-4"
          como="select"
          name="estado"
          value={valores.estado}
          onChange={manejarCambio}
        >
          {ESTADOS_PRODUCTO.map((estado) => (
            <option key={estado.valor} value={estado.valor}>
              {estado.texto}
            </option>
          ))}
        </CampoPanel>
        <CampoPanel
          etiqueta="Stock"
          ancho="span-4"
          type="number"
          name="stock"
          min="0"
          step="1"
          value={valores.stock}
          onChange={manejarCambio}
          error={errores.stock}
        />
        <CampoPanel
          etiqueta={`Descripción (${valores.descripcion.length}/${LIMITES.descripcion})`}
          name="descripcion"
          value={valores.descripcion}
          onChange={manejarCambio}
          error={errores.descripcion}
          maxLength={LIMITES.descripcion}
        />

        {/* Sugerencias para el campo talla (también se puede escribir otra) */}
        <datalist id="tallas-sugeridas">
          {TALLAS_SUGERIDAS.map((talla) => (
            <option key={talla} value={talla} />
          ))}
        </datalist>

        <label className="casilla completo">
          <input type="checkbox" name="activo" checked={valores.activo} onChange={manejarCambio} />
          Visible en la tienda
        </label>

        <div className="acciones">
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : producto ? 'Actualizar producto' : 'Guardar producto'}
          </button>
          <button type="button" className="secundario" onClick={alCancelar} disabled={guardando}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
