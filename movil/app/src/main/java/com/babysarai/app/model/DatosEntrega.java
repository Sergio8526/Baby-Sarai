package com.babysarai.app.model;

/**
 * Datos que el cliente escribe en el formulario de pedido (checkout).
 */
public class DatosEntrega {

    private final String nombre;
    private final String telefono;
    private final String direccion;
    private final String ciudad;
    private final String metodoPago;

    public DatosEntrega(String nombre, String telefono, String direccion,
                        String ciudad, String metodoPago) {
        this.nombre = limpiar(nombre);
        this.telefono = limpiar(telefono).replace(" ", "");
        this.direccion = limpiar(direccion);
        this.ciudad = limpiar(ciudad);
        this.metodoPago = limpiar(metodoPago);
    }

    private static String limpiar(String texto) {
        return texto == null ? "" : texto.trim();
    }

    public String getNombre() { return nombre; }
    public String getTelefono() { return telefono; }
    public String getDireccion() { return direccion; }
    public String getCiudad() { return ciudad; }
    public String getMetodoPago() { return metodoPago; }
}
