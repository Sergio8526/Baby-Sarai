package com.babysarai.app.model;

/**
 * Una línea del carrito de compras: un producto y la cantidad elegida.
 * Se guarda en la base de datos local (SQLite) del teléfono.
 */
public class ItemCarrito {

    private final int productoId;
    private final String nombre;
    private final String talla;
    private final String categoriaNombre;
    private final double precioUnitario;
    private final int cantidad;
    private final int stockDisponible;

    public ItemCarrito(int productoId, String nombre, String talla, String categoriaNombre,
                       double precioUnitario, int cantidad, int stockDisponible) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.talla = talla;
        this.categoriaNombre = categoriaNombre;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.stockDisponible = stockDisponible;
    }

    /** Crea la línea del carrito a partir de un producto del catálogo. */
    public static ItemCarrito desdeProducto(Producto p, int cantidad) {
        return new ItemCarrito(p.getId(), p.getNombre(), p.getTalla(), p.getCategoriaNombre(),
                p.getPrecio(), cantidad, p.getStock());
    }

    /** Devuelve una copia con otra cantidad (los objetos son inmutables). */
    public ItemCarrito conCantidad(int nuevaCantidad) {
        return new ItemCarrito(productoId, nombre, talla, categoriaNombre,
                precioUnitario, nuevaCantidad, stockDisponible);
    }

    public int getProductoId() { return productoId; }
    public String getNombre() { return nombre; }
    public String getTalla() { return talla; }
    public String getCategoriaNombre() { return categoriaNombre; }
    public double getPrecioUnitario() { return precioUnitario; }
    public int getCantidad() { return cantidad; }
    public int getStockDisponible() { return stockDisponible; }

    /** @return precio unitario por cantidad. */
    public double getSubtotal() { return precioUnitario * cantidad; }
}
