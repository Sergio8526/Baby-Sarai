package com.babysarai.app.data.repository;

/**
 * Respuesta que entregan los repositorios a los ViewModel.
 * Indica si los datos vinieron del servidor o de los datos de demostración,
 * y trae un mensaje para el usuario cuando algo no salió como se esperaba.
 *
 * @param <T> tipo de los datos
 */
public class Resultado<T> {

    private final T datos;
    private final boolean desdeServidor;
    private final String mensaje;

    private Resultado(T datos, boolean desdeServidor, String mensaje) {
        this.datos = datos;
        this.desdeServidor = desdeServidor;
        this.mensaje = mensaje;
    }

    /** Datos obtenidos de la API. */
    public static <T> Resultado<T> delServidor(T datos) {
        return new Resultado<>(datos, true, null);
    }

    /** Datos de respaldo (modo sin conexión), con el motivo. */
    public static <T> Resultado<T> deRespaldo(T datos, String motivo) {
        return new Resultado<>(datos, false, motivo);
    }

    /** No hay datos que mostrar. */
    public static <T> Resultado<T> error(String mensaje) {
        return new Resultado<>(null, false, mensaje);
    }

    public T getDatos() { return datos; }
    public boolean isDesdeServidor() { return desdeServidor; }
    public String getMensaje() { return mensaje; }
    public boolean tieneDatos() { return datos != null; }
}
