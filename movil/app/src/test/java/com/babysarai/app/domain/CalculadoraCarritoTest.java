package com.babysarai.app.domain;

import static org.junit.Assert.assertEquals;

import com.babysarai.app.model.ItemCarrito;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Pruebas del módulo Carrito: subtotal, envío, total y control de stock.
 */
public class CalculadoraCarritoTest {

    private static final double DELTA = 0.001;

    private ItemCarrito item(int id, double precio, int cantidad, int stock) {
        return new ItemCarrito(id, "Prenda " + id, "0-3 meses", "Bodies", precio, cantidad, stock);
    }

    @Test
    public void subtotalSumaPrecioPorCantidad() {
        List<ItemCarrito> items = Arrays.asList(item(1, 25000, 2, 5), item(2, 12000, 1, 3));
        assertEquals(62000, CalculadoraCarrito.subtotal(items), DELTA);
    }

    @Test
    public void carritoVacioONuloSumaCero() {
        assertEquals(0, CalculadoraCarrito.subtotal(new ArrayList<>()), DELTA);
        assertEquals(0, CalculadoraCarrito.subtotal(null), DELTA);
        assertEquals(0, CalculadoraCarrito.total(Collections.emptyList()), DELTA);
        assertEquals(0, CalculadoraCarrito.cantidadArticulos(null));
    }

    @Test
    public void envioCuesta12000PorDebajoDe150000() {
        assertEquals(12000, CalculadoraCarrito.envio(149_999), DELTA);
        assertEquals(12000, CalculadoraCarrito.envio(20_000), DELTA);
    }

    @Test
    public void envioGratisDesde150000() {
        assertEquals(0, CalculadoraCarrito.envio(150_000), DELTA);
        assertEquals(0, CalculadoraCarrito.envio(300_000), DELTA);
    }

    @Test
    public void sinProductosNoSeCobraEnvio() {
        assertEquals(0, CalculadoraCarrito.envio(0), DELTA);
    }

    @Test
    public void totalIncluyeElEnvio() {
        List<ItemCarrito> items = Collections.singletonList(item(1, 38000, 1, 3));
        assertEquals(50000, CalculadoraCarrito.total(items), DELTA);
    }

    @Test
    public void cuentaTodasLasPrendas() {
        List<ItemCarrito> items = Arrays.asList(item(1, 25000, 2, 5), item(2, 12000, 3, 10));
        assertEquals(5, CalculadoraCarrito.cantidadArticulos(items));
    }

    @Test
    public void calculaCuantoFaltaParaEnvioGratis() {
        assertEquals(50_000, CalculadoraCarrito.faltaParaEnvioGratis(100_000), DELTA);
        assertEquals(0, CalculadoraCarrito.faltaParaEnvioGratis(150_000), DELTA);
        assertEquals(0, CalculadoraCarrito.faltaParaEnvioGratis(0), DELTA);
    }

    @Test
    public void noSuperaElStockAlAgregar() {
        assertEquals(3, CalculadoraCarrito.cantidadPermitida(0, 3, 4));   // Hay stock suficiente
        assertEquals(4, CalculadoraCarrito.cantidadPermitida(3, 5, 4));   // Se limita al stock
        assertEquals(4, CalculadoraCarrito.cantidadPermitida(4, 1, 4));   // Ya está completo
    }

    @Test(expected = IllegalArgumentException.class)
    public void rechazaCantidadCeroONegativa() {
        CalculadoraCarrito.cantidadPermitida(1, 0, 5);
    }
}
