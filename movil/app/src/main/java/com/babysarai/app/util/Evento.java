package com.babysarai.app.util;

/**
 * Envoltorio para datos que se deben mostrar una sola vez (un mensaje,
 * una navegación). Evita que un Snackbar se repita al girar la pantalla,
 * porque LiveData vuelve a entregar su último valor a los observadores nuevos.
 *
 * @param <T> tipo del contenido
 */
public class Evento<T> {

    private final T contenido;
    private boolean usado = false;

    public Evento(T contenido) {
        this.contenido = contenido;
    }

    /** Devuelve el contenido solo la primera vez; después devuelve null. */
    public T obtenerSiNoUsado() {
        if (usado) {
            return null;
        }
        usado = true;
        return contenido;
    }

    /** Devuelve el contenido aunque ya se haya usado. */
    public T verContenido() {
        return contenido;
    }
}
