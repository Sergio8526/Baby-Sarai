package com.babysarai.app.domain;

import com.babysarai.app.model.ItemCarrito;

import java.util.List;

/**
 * Reglas de negocio del carrito de compras de Baby Saraí.
 *
 * <ul>
 *   <li>Envío gratis en compras desde $150.000.</li>
 *   <li>Por debajo de ese valor el envío cuesta $12.000.</li>
 *   <li>No se puede pedir más unidades de las que hay en stock.</li>
 * </ul>
 *
 * No depende de Android, así que se prueba con JUnit en el computador.
 */
public final class CalculadoraCarrito {

    public static final double MINIMO_ENVIO_GRATIS = 150_000;
    public static final double COSTO_ENVIO = 12_000;

    private CalculadoraCarrito() {
    }

    /** Suma de precio × cantidad de todas las líneas. */
    public static double subtotal(List<ItemCarrito> items) {
        double suma = 0;
        if (items == null) {
            return suma;
        }
        for (ItemCarrito item : items) {
            suma += item.getSubtotal();
        }
        return suma;
    }

    /** Costo del envío según el subtotal (0 si el carrito está vacío). */
    public static double envio(double subtotal) {
        if (subtotal <= 0) {
            return 0;
        }
        return subtotal >= MINIMO_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
    }

    /** Subtotal más envío. */
    public static double total(List<ItemCarrito> items) {
        double subtotal = subtotal(items);
        return subtotal + envio(subtotal);
    }

    /** Número total de prendas (suma de cantidades). */
    public static int cantidadArticulos(List<ItemCarrito> items) {
        int total = 0;
        if (items == null) {
            return total;
        }
        for (ItemCarrito item : items) {
            total += item.getCantidad();
        }
        return total;
    }

    /** Cuánto le falta al cliente para tener envío gratis (0 si ya lo tiene). */
    public static double faltaParaEnvioGratis(double subtotal) {
        if (subtotal <= 0 || subtotal >= MINIMO_ENVIO_GRATIS) {
            return 0;
        }
        return MINIMO_ENVIO_GRATIS - subtotal;
    }

    /**
     * Calcula la nueva cantidad de un producto en el carrito sin pasar el stock.
     *
     * @param enCarrito unidades que ya están en el carrito
     * @param aAgregar  unidades que el cliente quiere sumar (mayor que cero)
     * @param stock     unidades disponibles en la tienda
     * @return cantidad final permitida
     * @throws IllegalArgumentException si aAgregar es cero o negativo
     */
    public static int cantidadPermitida(int enCarrito, int aAgregar, int stock) {
        if (aAgregar <= 0) {
            throw new IllegalArgumentException("La cantidad a agregar debe ser mayor que cero");
        }
        return Math.max(0, Math.min(enCarrito + aAgregar, stock));
    }
}
