package com.babysarai.app.domain;

import com.babysarai.app.model.DatosEntrega;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Valida el formulario de pedido antes de registrarlo.
 * Devuelve un mapa campo → mensaje de error; si está vacío, los datos son válidos.
 */
public final class ValidadorPedido {

    public static final String CAMPO_NOMBRE = "nombre";
    public static final String CAMPO_TELEFONO = "telefono";
    public static final String CAMPO_DIRECCION = "direccion";
    public static final String CAMPO_CIUDAD = "ciudad";
    public static final String CAMPO_PAGO = "metodoPago";

    /** Métodos de pago que acepta la tienda. */
    public static final List<String> METODOS_PAGO = Arrays.asList(
            "Pago contraentrega",
            "Transferencia Nequi / Daviplata",
            "Tarjeta o PSE");

    private static final String PATRON_NOMBRE = "[\\p{L} ]+";      // Letras (con tildes) y espacios
    private static final String PATRON_CELULAR = "3\\d{9}";        // Celular colombiano: 10 dígitos, empieza por 3
    private static final int MINIMO_DIRECCION = 8;

    private ValidadorPedido() {
    }

    public static Map<String, String> validar(DatosEntrega datos) {
        Map<String, String> errores = new LinkedHashMap<>();

        String nombre = datos.getNombre();
        if (nombre.isEmpty()) {
            errores.put(CAMPO_NOMBRE, "Escribe tu nombre completo");
        } else if (!nombre.matches(PATRON_NOMBRE)) {
            errores.put(CAMPO_NOMBRE, "El nombre solo puede tener letras y espacios");
        } else if (nombre.replace(" ", "").length() < 3) {
            errores.put(CAMPO_NOMBRE, "El nombre debe tener al menos 3 letras");
        }

        if (!datos.getTelefono().matches(PATRON_CELULAR)) {
            errores.put(CAMPO_TELEFONO, "Escribe un celular de 10 dígitos que empiece por 3");
        }

        if (datos.getDireccion().length() < MINIMO_DIRECCION) {
            errores.put(CAMPO_DIRECCION, "Escribe la dirección completa (mínimo 8 caracteres)");
        }

        if (datos.getCiudad().isEmpty()) {
            errores.put(CAMPO_CIUDAD, "Escribe la ciudad de entrega");
        }

        if (!METODOS_PAGO.contains(datos.getMetodoPago())) {
            errores.put(CAMPO_PAGO, "Elige un método de pago");
        }

        return errores;
    }
}
