/**
 * Paso 2 de la compra: datos de envío y confirmación del pedido.
 * Envía el carrito a la API (POST /api/v1/pedidos). La API toma los precios de la
 * base de datos, revisa el stock y descuenta el inventario en una transacción.
 */
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import PasosCompra from '../../components/carrito/PasosCompra.jsx';
import CampoTienda from '../../components/formularios/CampoTienda.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { crearPedido } from '../../services/pedidoService.js';
import { formatearPrecio } from '../../utils/formato.js';
import { calcularEnvio, itemsParaPedido } from '../../utils/pedidos.js';
import { validarEnvio } from '../../utils/validaciones.js';

export default function Checkout() {
  const { usuario } = useAuth();
  const { items, subtotal, vaciar } = useCart();
  const navigate = useNavigate();

  const [valores, setValores] = useState({
    direccionEnvio: '',
    ciudad: 'Bogotá',
    telefono: usuario?.telefono ?? '',
    notas: '',
  });
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Sin productos no hay nada que pagar (también cubre volver atrás después de comprar)
  if (items.length === 0 && !enviando) return <Navigate to="/carrito" replace />;

  const envio = calcularEnvio(subtotal);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
  };

  const confirmar = async (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarEnvio(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setErrorApi(null);
    try {
      const { pedido } = await crearPedido({
        items: itemsParaPedido(items),
        direccionEnvio: valores.direccionEnvio.trim(),
        ciudad: valores.ciudad.trim(),
        telefono: valores.telefono.trim(),
        notas: valores.notas.trim() || undefined,
      });
      vaciar();
      navigate(`/mis-pedidos/${pedido.id}`, { replace: true, state: { recienCreado: true } });
    } catch (error) {
      // 409: algún producto se agotó mientras el cliente compraba
      setErrorApi(error);
      setEnviando(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="section section--tight">
      <div className="wrap">
        <PasosCompra pasoActual={2} />
        <h1 className="titulo-pagina">Datos de envío</h1>

        {errorApi && (
          <div className="aviso-cuenta aviso-cuenta--error" role="alert">
            {errorApi.message}
            {errorApi.detalles?.length > 0 && (
              <ul>
                {errorApi.detalles.map((detalle) => (
                  <li key={detalle}>{detalle}</li>
                ))}
              </ul>
            )}
            {errorApi.estado === 409 && (
              <p>
                <Link to="/carrito">Ajusta las cantidades en tu carrito</Link> y vuelve a
                intentarlo.
              </p>
            )}
          </div>
        )}

        <div className="cart-layout">
          <form id="form-envio" className="cuenta-card" onSubmit={confirmar} noValidate>
            <p className="cuenta-bajada">
              Compras como <strong>{usuario.nombre}</strong> ({usuario.email}).
            </p>
            <CampoTienda
              etiqueta="Dirección de entrega"
              name="direccionEnvio"
              autoComplete="street-address"
              placeholder="Calle 140 # 12-30, apto 402"
              value={valores.direccionEnvio}
              onChange={manejarCambio}
              error={errores.direccionEnvio}
              maxLength={200}
            />
            <div className="form-grid">
              <CampoTienda
                etiqueta="Ciudad"
                name="ciudad"
                autoComplete="address-level2"
                value={valores.ciudad}
                onChange={manejarCambio}
                error={errores.ciudad}
                maxLength={60}
              />
              <CampoTienda
                etiqueta="Teléfono de contacto"
                type="tel"
                name="telefono"
                autoComplete="tel"
                value={valores.telefono}
                onChange={manejarCambio}
                error={errores.telefono}
              />
            </div>
            <CampoTienda
              etiqueta="Notas para la entrega (opcional)"
              como="textarea"
              name="notas"
              placeholder="Ej.: dejar en portería"
              value={valores.notas}
              onChange={manejarCambio}
              error={errores.notas}
              maxLength={255}
            />
          </form>

          <aside className="summary-card" aria-label="Resumen del pedido">
            <h2 className="summary-titulo">Tu pedido</h2>
            <ul className="resumen-items">
              {items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.cantidad} × {item.nombre}
                  </span>
                  <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{envio ? formatearPrecio(envio) : 'Gratis'}</span>
            </div>
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatearPrecio(subtotal + envio)}</span>
            </div>
            <button
              type="submit"
              form="form-envio"
              className="btn btn-primary btn-block"
              disabled={enviando}
            >
              {enviando ? 'Confirmando...' : 'Confirmar pedido'}
            </button>
            <p className="summary-nota">
              El pago se coordina al confirmar el pedido. Puedes cancelarlo mientras esté pendiente.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
