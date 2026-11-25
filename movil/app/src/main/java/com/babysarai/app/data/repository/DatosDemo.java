package com.babysarai.app.data.repository;

import com.babysarai.app.model.Categoria;
import com.babysarai.app.model.Producto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Datos de demostración. Son los mismos registros de los scripts
 * database/002_catalogo.sql y 003_datos_prueba.sql del backend.
 *
 * Se usan cuando la app no logra conectarse con el servidor, para que
 * el catálogo se pueda revisar aunque la API no esté encendida.
 */
public final class DatosDemo {

    private DatosDemo() {
    }

    public static List<Categoria> categorias() {
        return new ArrayList<>(Arrays.asList(
                new Categoria(1, "Recién nacido", "Prendas para bebés de 0 a 3 meses"),
                new Categoria(2, "Bodies", "Bodies de manga corta y manga larga"),
                new Categoria(3, "Pijamas", "Pijamas y enterizos para dormir"),
                new Categoria(4, "Conjuntos", "Conjuntos de dos o más piezas"),
                new Categoria(5, "Accesorios", "Gorros, baberos, medias y mantas"),
                new Categoria(6, "Calzado", "Zapatos y patucos para bebé")));
    }

    public static List<Producto> productos() {
        return new ArrayList<>(Arrays.asList(
                new Producto(1, "Body manga larga 0-3 meses", "Body de algodón manga larga, color blanco",
                        1, "Recién nacido", "0-3 meses", Producto.ESTADO_NUEVO, 25000, 4),
                new Producto(2, "Body manga corta rayas", "Body de algodón manga corta con rayas azules",
                        1, "Recién nacido", "0-3 meses", Producto.ESTADO_USADO, 15000, 2),
                new Producto(3, "Body básico rosado", "Body manga corta 100% algodón",
                        2, "Bodies", "6-9 meses", Producto.ESTADO_NUEVO, 20000, 6),
                new Producto(4, "Pijama enteriza ositos", "Pijama enteriza con cierre, estampado de ositos",
                        3, "Pijamas", "3-6 meses", Producto.ESTADO_NUEVO, 38000, 3),
                new Producto(5, "Gorro tejido", "Gorro tejido a mano para recién nacido",
                        5, "Accesorios", "Única", Producto.ESTADO_NUEVO, 12000, 10),
                new Producto(6, "Conjunto camiseta y short", "Conjunto de dos piezas en algodón, estampado de nubes",
                        4, "Conjuntos", "12 meses", Producto.ESTADO_USADO, 28000, 1),
                new Producto(7, "Patucos de lana", "Patucos tejidos con cordón, suela antideslizante",
                        6, "Calzado", "0-6 meses", Producto.ESTADO_NUEVO, 18000, 5),
                new Producto(8, "Pijama dos piezas estrellas", "Pijama de algodón perchado para clima frío",
                        3, "Pijamas", "9-12 meses", Producto.ESTADO_USADO, 22000, 0)));
    }

    /** Busca un producto de demostración por id; devuelve null si no existe. */
    public static Producto buscarProducto(int id) {
        for (Producto p : productos()) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }
}
