/**
 * Gestión de categorías (CRUD).
 * También consulta los productos para mostrar cuántos tiene cada categoría,
 * porque la base de datos no deja eliminar una categoría con productos.
 */
import { useState } from 'react';
import FormularioCategoria from '../../components/admin/FormularioCategoria.jsx';
import TablaCategorias from '../../components/admin/TablaCategorias.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Mensaje from '../../components/ui/Mensaje.jsx';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from '../../services/categoriaService.js';
import { listarProductos } from '../../services/productoService.js';

/**
 * Cuenta los productos de cada categoría.
 * @param {Object[]} productos
 * @returns {Object<number, number>} Ejemplo: { 1: 4, 2: 0 }
 */
function contarPorCategoria(productos) {
  return productos.reduce((conteo, producto) => {
    conteo[producto.categoriaId] = (conteo[producto.categoriaId] ?? 0) + 1;
    return conteo;
  }, {});
}

export default function GestionCategorias() {
  const categorias = useConsulta(listarCategorias);
  const productos = useConsulta(listarProductos);

  const [formulario, setFormulario] = useState(null); // null | { categoria }
  const [porEliminar, setPorEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [aviso, setAviso] = useState(null);

  const guardar = async (datos) => {
    setProcesando(true);
    try {
      const editando = formulario.categoria;
      const respuesta = editando
        ? await actualizarCategoria(editando.id, datos)
        : await crearCategoria(datos);
      setAviso({ tipo: 'exito', mensaje: respuesta.mensaje });
      setFormulario(null);
      categorias.recargar();
    } catch (error) {
      // Ejemplo: 409 "Ya existe un registro con ese nombre"
      setAviso({ tipo: 'error', mensaje: error.message, detalles: error.detalles });
    } finally {
      setProcesando(false);
    }
  };

  const confirmarEliminacion = async () => {
    setProcesando(true);
    try {
      const respuesta = await eliminarCategoria(porEliminar.id);
      setAviso({ tipo: 'exito', mensaje: respuesta.mensaje });
      categorias.recargar();
    } catch (error) {
      // Ejemplo: 409 "No se puede eliminar porque tiene productos asociados"
      setAviso({ tipo: 'error', mensaje: error.message });
    } finally {
      setProcesando(false);
      setPorEliminar(null);
    }
  };

  const abrirFormulario = (categoria = null) => {
    setAviso(null);
    setFormulario({ categoria });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (categorias.cargando && !categorias.datos) return <Loader texto="Cargando categorías..." />;

  if (categorias.error) {
    return (
      <Mensaje tipo="error">
        {categorias.error.message}{' '}
        <button type="button" className="pequeno" onClick={categorias.recargar}>
          Reintentar
        </button>
      </Mensaje>
    );
  }

  return (
    <>
      <div className="cabecera-pagina">
        <div>
          <h1>Categorías</h1>
          <p>Organiza el catálogo. Una categoría inactiva no aparece en la tienda.</p>
        </div>
        {!formulario && (
          <button type="button" onClick={() => abrirFormulario()}>
            + Nueva categoría
          </button>
        )}
      </div>

      {aviso && (
        <Mensaje tipo={aviso.tipo} detalles={aviso.detalles} alCerrar={() => setAviso(null)}>
          {aviso.mensaje}
        </Mensaje>
      )}

      {formulario && (
        <FormularioCategoria
          key={formulario.categoria?.id ?? 'nueva'}
          categoria={formulario.categoria}
          guardando={procesando}
          alGuardar={guardar}
          alCancelar={() => setFormulario(null)}
        />
      )}

      <section className="tarjeta">
        <div className="encabezado-tabla">
          <h2>Listado</h2>
        </div>
        <TablaCategorias
          categorias={categorias.datos ?? []}
          conteoProductos={contarPorCategoria(productos.datos ?? [])}
          alEditar={abrirFormulario}
          alEliminar={setPorEliminar}
        />
      </section>

      <ModalConfirmacion
        abierto={Boolean(porEliminar)}
        titulo={`¿Eliminar la categoría “${porEliminar?.nombre ?? ''}”?`}
        procesando={procesando}
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setPorEliminar(null)}
      >
        Esta acción no se puede deshacer.
      </ModalConfirmacion>
    </>
  );
}
