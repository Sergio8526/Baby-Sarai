/**
 * Gestión de productos (CRUD): listar, filtrar, crear, editar y eliminar.
 * Esta página coordina: consulta la API, guarda qué producto se edita y
 * pasa datos y funciones a FormularioProducto y TablaProductos.
 */
import { useState } from 'react';
import FormularioProducto from '../../components/admin/FormularioProducto.jsx';
import TablaProductos from '../../components/admin/TablaProductos.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Mensaje from '../../components/ui/Mensaje.jsx';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarCategorias } from '../../services/categoriaService.js';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from '../../services/productoService.js';
import { normalizarTexto } from '../../utils/formato.js';

export default function GestionProductos() {
  const productos = useConsulta(listarProductos);
  const categorias = useConsulta(listarCategorias);

  // formulario: null = cerrado | { producto: null } = nuevo | { producto: {...} } = edición
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo, mensaje, detalles }
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  /**
   * Crea o actualiza según el modo del formulario y recarga la tabla.
   * @param {Object} datos - Datos ya validados por el formulario.
   */
  const guardar = async (datos) => {
    setProcesando(true);
    try {
      const editando = formulario.producto;
      const respuesta = editando
        ? await actualizarProducto(editando.id, datos)
        : await crearProducto(datos);
      setAviso({ tipo: 'exito', mensaje: respuesta.mensaje });
      setFormulario(null);
      productos.recargar();
    } catch (error) {
      // Los detalles son la lista de errores de validación que envía el back-end
      setAviso({ tipo: 'error', mensaje: error.message, detalles: error.detalles });
    } finally {
      setProcesando(false);
    }
  };

  /** Elimina el producto confirmado en la ventana. */
  const confirmarEliminacion = async () => {
    setProcesando(true);
    try {
      const respuesta = await eliminarProducto(porEliminar.id);
      setAviso({ tipo: 'exito', mensaje: respuesta.mensaje });
      productos.recargar();
    } catch (error) {
      setAviso({ tipo: 'error', mensaje: error.message });
    } finally {
      setProcesando(false);
      setPorEliminar(null);
    }
  };

  const abrirFormulario = (producto = null) => {
    setAviso(null);
    setFormulario({ producto });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (productos.cargando && !productos.datos) return <Loader texto="Cargando productos..." />;

  const error = productos.error || categorias.error;
  if (error) {
    return (
      <Mensaje tipo="error">
        {error.message}{' '}
        <button type="button" className="pequeno" onClick={productos.recargar}>
          Reintentar
        </button>
      </Mensaje>
    );
  }

  // Filtros de la tabla (búsqueda por nombre y categoría)
  const textoBuscado = normalizarTexto(busqueda);
  const visibles = (productos.datos ?? []).filter(
    (p) =>
      (!textoBuscado || normalizarTexto(p.nombre).includes(textoBuscado)) &&
      (!filtroCategoria || String(p.categoriaId) === filtroCategoria)
  );

  return (
    <>
      <div className="cabecera-pagina">
        <div>
          <h1>Productos</h1>
          <p>
            Registra los productos de la tienda, actualiza precios y stock, y decide cuáles se ven
            en la tienda.
          </p>
        </div>
        {!formulario && (
          <button type="button" onClick={() => abrirFormulario()}>
            + Nuevo producto
          </button>
        )}
      </div>

      {aviso && (
        <Mensaje tipo={aviso.tipo} detalles={aviso.detalles} alCerrar={() => setAviso(null)}>
          {aviso.mensaje}
        </Mensaje>
      )}

      {formulario && (
        <FormularioProducto
          // Al cambiar la key, React crea el formulario de nuevo con los datos del producto elegido
          key={formulario.producto?.id ?? 'nuevo'}
          producto={formulario.producto}
          categorias={categorias.datos ?? []}
          guardando={procesando}
          alGuardar={guardar}
          alCancelar={() => setFormulario(null)}
        />
      )}

      <section className="tarjeta">
        <div className="encabezado-tabla">
          <h2>Inventario</h2>
          <div className="filtros-tabla">
            <input
              type="search"
              placeholder="Buscar por nombre"
              aria-label="Buscar por nombre"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
            <select
              aria-label="Filtrar por categoría"
              value={filtroCategoria}
              onChange={(evento) => setFiltroCategoria(evento.target.value)}
            >
              <option value="">Todas las categorías</option>
              {(categorias.datos ?? []).map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <TablaProductos
          productos={visibles}
          alEditar={abrirFormulario}
          alEliminar={setPorEliminar}
        />
      </section>

      <ModalConfirmacion
        abierto={Boolean(porEliminar)}
        titulo={`¿Eliminar “${porEliminar?.nombre ?? ''}”?`}
        procesando={procesando}
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setPorEliminar(null)}
      >
        Esta acción no se puede deshacer. Si solo quieres ocultarlo, edítalo y desmarca “Visible en
        la tienda”.
      </ModalConfirmacion>
    </>
  );
}
