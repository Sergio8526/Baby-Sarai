package com.babysarai.app.domain;

import com.babysarai.app.model.Producto;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Filtra el catálogo por categoría y por texto de búsqueda.
 * La búsqueda ignora mayúsculas y tildes: "pijama" encuentra "Pijama" y
 * "recien" encuentra "Recién nacido".
 */
public final class FiltroCatalogo {

    private FiltroCatalogo() {
    }

    /**
     * @param productos   lista completa
     * @param categoriaId categoría elegida o null para todas
     * @param texto       texto buscado (puede ser vacío o null)
     * @return productos publicados que cumplen ambos filtros
     */
    public static List<Producto> filtrar(List<Producto> productos, Integer categoriaId, String texto) {
        List<Producto> resultado = new ArrayList<>();
        if (productos == null) {
            return resultado;
        }
        String buscado = normalizar(texto);

        for (Producto p : productos) {
            if (!p.estaActivo()) {
                continue;
            }
            if (categoriaId != null && p.getCategoriaId() != categoriaId) {
                continue;
            }
            if (!buscado.isEmpty()) {
                String contenido = normalizar(p.getNombre()) + " "
                        + normalizar(p.getDescripcion()) + " "
                        + normalizar(p.getTalla()) + " "
                        + normalizar(p.getCategoriaNombre());
                if (!contenido.contains(buscado)) {
                    continue;
                }
            }
            resultado.add(p);
        }
        return resultado;
    }

    /** Minúsculas, sin espacios a los lados y sin tildes. */
    static String normalizar(String texto) {
        if (texto == null) {
            return "";
        }
        String sinTildes = Normalizer.normalize(texto.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD);
        return sinTildes.replaceAll("\\p{M}", "");
    }
}
