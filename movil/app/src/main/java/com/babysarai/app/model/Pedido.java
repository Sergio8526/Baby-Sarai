package com.babysarai.app.model;

/**
 * Pedido registrado desde la app. Se guarda en SQLite junto con su detalle.
 */
public class Pedido {

    public static final String ESTADO_RECIBIDO = "Recibido";

    private final long id;
    private final String fecha;
    private final String cliente;
    private final String telefono;
    private final String direccion;
    private final String ciudad;
    private final String metodoPago;
    private final double subtotal;
    private final double envio;
    private final double total;
    private final int articulos;
    private final String estado;

    public Pedido(long id, String fecha, String cliente, String telefono, String direccion,
                  String ciudad, String metodoPago, double subtotal, double envio,
                  double total, int articulos, String estado) {
        this.id = id;
        this.fecha = fecha;
        this.cliente = cliente;
        this.telefono = telefono;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.metodoPago = metodoPago;
        this.subtotal = subtotal;
        this.envio = envio;
        this.total = total;
        this.articulos = articulos;
        this.estado = estado;
    }

    public long getId() { return id; }
    public String getFecha() { return fecha; }
    public String getCliente() { return cliente; }
    public String getTelefono() { return telefono; }
    public String getDireccion() { return direccion; }
    public String getCiudad() { return ciudad; }
    public String getMetodoPago() { return metodoPago; }
    public double getSubtotal() { return subtotal; }
    public double getEnvio() { return envio; }
    public double getTotal() { return total; }
    public int getArticulos() { return articulos; }
    public String getEstado() { return estado; }
}
