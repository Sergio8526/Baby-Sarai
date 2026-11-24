/**
 * Gestión de usuarios (administradora): ver las cuentas, cambiar el rol y
 * activar o desactivar. Una cuenta desactivada no puede iniciar sesión y su
 * token deja de servir de inmediato (la API revisa el usuario en cada petición).
 */
import { useState } from 'react';
import Etiqueta from '../../components/ui/Etiqueta.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Mensaje from '../../components/ui/Mensaje.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useConsulta } from '../../hooks/useConsulta.js';
import { actualizarUsuario, listarUsuarios } from '../../services/usuarioService.js';
import { ROLES } from '../../utils/constantes.js';
import { formatearFecha, normalizarTexto } from '../../utils/formato.js';

export default function GestionUsuarios() {
  const { usuario: yo } = useAuth();
  const usuarios = useConsulta(listarUsuarios);
  const [filtroRol, setFiltroRol] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [procesando, setProcesando] = useState(null); // id en proceso
  const [aviso, setAviso] = useState(null);

  const actualizar = async (usuario, cambios) => {
    setProcesando(usuario.id);
    try {
      const respuesta = await actualizarUsuario(usuario.id, cambios);
      setAviso({ tipo: 'exito', mensaje: `${respuesta.mensaje}: ${respuesta.usuario.nombre}` });
      usuarios.recargar();
    } catch (error) {
      setAviso({ tipo: 'error', mensaje: error.message });
    } finally {
      setProcesando(null);
    }
  };

  if (usuarios.cargando && !usuarios.datos) return <Loader texto="Cargando usuarios..." />;
  if (usuarios.error) return <Mensaje tipo="error">{usuarios.error.message}</Mensaje>;

  const texto = normalizarTexto(busqueda);
  const visibles = usuarios.datos.filter(
    (u) =>
      (!filtroRol || u.rol === filtroRol) &&
      (!texto || normalizarTexto(u.nombre).includes(texto) || u.email.includes(texto))
  );

  return (
    <>
      <div className="cabecera-pagina">
        <div>
          <h1>Usuarios</h1>
          <p>
            Clientes y administradoras de la tienda. Los nuevos clientes se registran en la tienda.
          </p>
        </div>
      </div>

      {aviso && (
        <Mensaje tipo={aviso.tipo} alCerrar={() => setAviso(null)}>
          {aviso.mensaje}
        </Mensaje>
      )}

      <section className="tarjeta">
        <div className="encabezado-tabla">
          <h2>
            {visibles.length} {visibles.length === 1 ? 'cuenta' : 'cuentas'}
          </h2>
          <div className="filtros-tabla">
            <input
              type="search"
              placeholder="Buscar por nombre o correo"
              aria-label="Buscar por nombre o correo"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
            <select
              aria-label="Filtrar por rol"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="cliente">Clientes</option>
              <option value="admin">Administradoras</option>
            </select>
          </div>
        </div>

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Contacto</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={5} className="vacio">
                    No hay cuentas con ese filtro.
                  </td>
                </tr>
              )}
              {visibles.map((usuario) => {
                const soyYo = usuario.id === yo.id;
                return (
                  <tr key={usuario.id}>
                    <td>
                      {usuario.nombre}
                      {soyYo && <small> (tú)</small>}
                      <br />
                      <small>
                        Desde {formatearFecha(usuario.fechaCreacion, { conHora: false })}
                      </small>
                    </td>
                    <td>
                      {usuario.email}
                      {usuario.telefono && (
                        <>
                          <br />
                          <small>{usuario.telefono}</small>
                        </>
                      )}
                    </td>
                    <td>{ROLES[usuario.rol]}</td>
                    <td>
                      <Etiqueta tono={usuario.activo ? 'si' : 'no'}>
                        {usuario.activo ? 'Activa' : 'Desactivada'}
                      </Etiqueta>
                    </td>
                    <td>
                      <div className="acciones-apiladas">
                        <button
                          type="button"
                          className="pequeno"
                          disabled={soyYo || procesando === usuario.id}
                          title={soyYo ? 'No puedes cambiar tu propio rol' : undefined}
                          onClick={() =>
                            actualizar(usuario, {
                              rol: usuario.rol === 'admin' ? 'cliente' : 'admin',
                            })
                          }
                        >
                          {usuario.rol === 'admin' ? 'Hacer cliente' : 'Hacer admin'}
                        </button>
                        <button
                          type="button"
                          className={`pequeno ${usuario.activo ? 'peligro' : ''}`}
                          disabled={soyYo || procesando === usuario.id}
                          title={soyYo ? 'No puedes desactivar tu propia cuenta' : undefined}
                          onClick={() => actualizar(usuario, { activo: !usuario.activo })}
                        >
                          {usuario.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
