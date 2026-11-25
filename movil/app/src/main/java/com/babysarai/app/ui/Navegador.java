package com.babysarai.app.ui;

/**
 * Acciones de navegación entre pantallas. La implementa MainActivity.
 * Los fragments la usan sin conocer a MainActivity: así quedan desacoplados
 * y se pueden reutilizar.
 */
public interface Navegador {
    void mostrarCatalogo();
    void abrirDetalle(int productoId);
    void mostrarCarrito();
    void abrirCheckout();
    void mostrarPedidos();
}
