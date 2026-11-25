package com.babysarai.app.util;

/**
 * Da formato de pesos colombianos a los precios: 39900 → "$39.900".
 *
 * <p>Se hace a mano (en vez de NumberFormat) para que el resultado sea
 * el mismo en cualquier teléfono, sin importar el idioma configurado.</p>
 */
public final class FormatoMoneda {

    private FormatoMoneda() {
        // Clase de utilidades: no se instancia
    }

    public static String formatear(double valor) {
        long redondeado = Math.round(valor);
        String digitos = String.valueOf(Math.abs(redondeado));

        StringBuilder resultado = new StringBuilder();
        int contador = 0;
        for (int i = digitos.length() - 1; i >= 0; i--) {
            resultado.insert(0, digitos.charAt(i));
            contador++;
            if (contador % 3 == 0 && i > 0) {
                resultado.insert(0, '.');
            }
        }
        return (redondeado < 0 ? "-$" : "$") + resultado;
    }
}
