package com.babysarai.app.domain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.babysarai.app.model.DatosEntrega;

import org.junit.Test;

import java.util.Map;

/**
 * Pruebas del módulo Pedido: validaciones del formulario de entrega.
 */
public class ValidadorPedidoTest {

    private static final String PAGO = ValidadorPedido.METODOS_PAGO.get(0);

    private Map<String, String> validar(String nombre, String tel, String dir, String ciudad, String pago) {
        return ValidadorPedido.validar(new DatosEntrega(nombre, tel, dir, ciudad, pago));
    }

    @Test
    public void datosCorrectosNoTienenErrores() {
        Map<String, String> errores = validar("María José Peña", "3001234567",
                "Calle 140 # 12-35 apto 302", "Bogotá", PAGO);
        assertTrue(errores.isEmpty());
    }

    @Test
    public void aceptaCelularConEspacios() {
        assertTrue(validar("Ana Gómez", "300 123 4567", "Carrera 7 # 120-20", "Bogotá", PAGO).isEmpty());
    }

    @Test
    public void formularioVacioMarcaTodosLosCampos() {
        Map<String, String> errores = validar("", "", "", "", "");
        assertEquals(5, errores.size());
    }

    @Test
    public void nombreConNumerosNoEsValido() {
        Map<String, String> errores = validar("Ana123", "3001234567", "Carrera 7 # 120-20", "Bogotá", PAGO);
        assertTrue(errores.containsKey(ValidadorPedido.CAMPO_NOMBRE));
    }

    @Test
    public void nombreMuyCortoNoEsValido() {
        Map<String, String> errores = validar("Al", "3001234567", "Carrera 7 # 120-20", "Bogotá", PAGO);
        assertEquals("El nombre debe tener al menos 3 letras", errores.get(ValidadorPedido.CAMPO_NOMBRE));
    }

    @Test
    public void celularDebeTener10DigitosYEmpezarPor3() {
        assertTrue(validar("Ana Gómez", "300123", "Carrera 7 # 120-20", "Bogotá", PAGO)
                .containsKey(ValidadorPedido.CAMPO_TELEFONO));
        assertTrue(validar("Ana Gómez", "6011234567", "Carrera 7 # 120-20", "Bogotá", PAGO)
                .containsKey(ValidadorPedido.CAMPO_TELEFONO));
        assertFalse(validar("Ana Gómez", "3209876543", "Carrera 7 # 120-20", "Bogotá", PAGO)
                .containsKey(ValidadorPedido.CAMPO_TELEFONO));
    }

    @Test
    public void direccionMuyCortaNoEsValida() {
        assertTrue(validar("Ana Gómez", "3001234567", "Cra 7", "Bogotá", PAGO)
                .containsKey(ValidadorPedido.CAMPO_DIRECCION));
    }

    @Test
    public void metodoDePagoDebeSerUnoDeLaLista() {
        assertTrue(validar("Ana Gómez", "3001234567", "Carrera 7 # 120-20", "Bogotá", "Bitcoin")
                .containsKey(ValidadorPedido.CAMPO_PAGO));
    }
}
