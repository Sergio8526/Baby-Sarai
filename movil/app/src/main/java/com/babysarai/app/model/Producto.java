package com.babysarai.app.model;

/**
 * Producto del catálogo de Baby Saraí.
 *
 * <p>Los nombres de los atributos coinciden con el JSON que devuelve la API
 * (GET /api/productos), por eso Gson los llena automáticamente sin anotaciones.</p>
 */
public class Producto {

    public static final String ESTADO_NUEVO = "nuevo";
    public static final String ESTADO_USADO = "usado";

    private int id;
    private String nombre;
    private String descripcion;
    private int categoriaId;
    private String categoriaNombre;
    private String talla;
    private String estado;
    private double precio;
    private int stock;
    private int activo = 1;   // La API envía 1 (visible en la tienda) o 0 (oculto)

    /** Constructor vacío: lo necesita Gson para crear el objeto desde el JSON. */
    public Producto() {
    }

    public Producto(int id, String nombre, String descripcion, int categoriaId,
                    String categoriaNombre, String talla, String estado,
                    double precio, int stock) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
        this.talla = talla;
        this.estado = estado;
        this.precio = precio;
        this.stock = stock;
        this.activo = 1;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public int getCategoriaId() { return categoriaId; }
    public String getCategoriaNombre() { return categoriaNombre; }
    public String getTalla() { return talla; }
    public String getEstado() { return estado; }
    public double getPrecio() { return precio; }
    public int getStock() { return stock; }

    public void setActivo(boolean visible) { this.activo = visible ? 1 : 0; }

    /** @return true si el producto está publicado en la tienda. */
    public boolean estaActivo() { return activo == 1; }

    /** @return true si se puede comprar: está publicado y hay unidades. */
    public boolean estaDisponible() { return estaActivo() && stock > 0; }

    /** @return true si la prenda es de segunda mano. */
    public boolean esUsado() { return ESTADO_USADO.equalsIgnoreCase(estado); }

    /** Texto amigable del estado para mostrar en pantalla. */
    public String getEstadoTexto() { return esUsado() ? "Segunda mano" : "Nuevo"; }
}
