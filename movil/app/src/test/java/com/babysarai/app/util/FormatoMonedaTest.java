package com.babysarai.app.util;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

/**
 * Pruebas del formato de pesos colombianos.
 */
public class FormatoMonedaTest {

    @Test
    public void separaMilesConPunto() {
        assertEquals("$39.900", FormatoMoneda.formatear(39900));
        assertEquals("$1.250.000", FormatoMoneda.formatear(1_250_000));
    }

    @Test
    public void valoresPequenosSinSeparador() {
        assertEquals("$0", FormatoMoneda.formatear(0));
        assertEquals("$900", FormatoMoneda.formatear(900));
    }

    @Test
    public void redondeaLosCentavos() {
        assertEquals("$25.001", FormatoMoneda.formatear(25000.5));
    }

    @Test
    public void muestraValoresNegativos() {
        assertEquals("-$12.000", FormatoMoneda.formatear(-12000));
    }
}
