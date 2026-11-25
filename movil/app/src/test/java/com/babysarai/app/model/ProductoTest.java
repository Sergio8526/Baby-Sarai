package com.babysarai.app.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * Pruebas de las reglas del modelo Producto e ItemCarrito.
 */
public class ProductoTest {

    private Producto producto(String estado, int stock) {
        return new Producto(1, "Body básico", "Algodón", 2, "Bodies", "6-9 meses", estado, 20000, stock);
    }

    @Test
    public void conStockEstaDisponible() {
        assertTrue(producto(Producto.ESTADO_NUEVO, 3).estaDisponible());
    }

    @Test
    public void sinStockEstaAgotado() {
        assertFalse(producto(Producto.ESTADO_NUEVO, 0).estaDisponible());
    }

    @Test
    public void inactivoNoEstaDisponible() {
        Producto p = producto(Producto.ESTADO_NUEVO, 3);
        p.setActivo(false);
        assertFalse(p.estaDisponible());
    }

    @Test
    public void muestraElEstadoEnTextoAmigable() {
        assertEquals("Segunda mano", producto(Producto.ESTADO_USADO, 1).getEstadoTexto());
        assertEquals("Nuevo", producto(Producto.ESTADO_NUEVO, 1).getEstadoTexto());
    }

    @Test
    public void itemCarritoCalculaSuSubtotal() {
        ItemCarrito item = ItemCarrito.desdeProducto(producto(Producto.ESTADO_NUEVO, 5), 3);
        assertEquals(60000, item.getSubtotal(), 0.001);
        assertEquals(5, item.getStockDisponible());
        assertEquals(2, item.conCantidad(2).getCantidad());
    }
}
