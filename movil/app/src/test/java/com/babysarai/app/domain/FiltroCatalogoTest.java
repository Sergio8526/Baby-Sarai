package com.babysarai.app.domain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import com.babysarai.app.data.repository.DatosDemo;
import com.babysarai.app.model.Producto;

import org.junit.Test;

import java.util.List;

/**
 * Pruebas del módulo Catálogo: búsqueda y filtro por categoría.
 * Usa los 8 productos de demostración (DatosDemo).
 */
public class FiltroCatalogoTest {

    private final List<Producto> productos = DatosDemo.productos();

    @Test
    public void sinFiltrosDevuelveTodosLosActivos() {
        assertEquals(8, FiltroCatalogo.filtrar(productos, null, "").size());
    }

    @Test
    public void filtraPorCategoria() {
        List<Producto> pijamas = FiltroCatalogo.filtrar(productos, 3, null);
        assertEquals(2, pijamas.size());
        for (Producto p : pijamas) {
            assertEquals(3, p.getCategoriaId());
        }
    }

    @Test
    public void buscaSinImportarMayusculasNiTildes() {
        assertEquals(2, FiltroCatalogo.filtrar(productos, null, "PIJAMA").size());
        // "algodon" sin tilde encuentra "algodón"
        assertTrue(FiltroCatalogo.filtrar(productos, null, "algodon").size() >= 4);
    }

    @Test
    public void combinaCategoriaYTexto() {
        List<Producto> r = FiltroCatalogo.filtrar(productos, 1, "rayas");
        assertEquals(1, r.size());
        assertEquals("Body manga corta rayas", r.get(0).getNombre());
    }

    @Test
    public void ocultaProductosInactivos() {
        List<Producto> lista = DatosDemo.productos();
        lista.get(0).setActivo(false);
        assertEquals(7, FiltroCatalogo.filtrar(lista, null, "").size());
    }

    @Test
    public void listaNulaDevuelveListaVacia() {
        assertTrue(FiltroCatalogo.filtrar(null, null, "body").isEmpty());
    }
}
