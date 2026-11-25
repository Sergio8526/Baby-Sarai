package com.babysarai.app.ui.comun;

import android.widget.ImageView;

import androidx.annotation.ColorRes;
import androidx.annotation.DrawableRes;
import androidx.core.content.ContextCompat;

import com.babysarai.app.R;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Elige la ilustración y el color de fondo de cada prenda según su categoría.
 * La tienda usa ilustraciones propias en lugar de fotos (identidad de marca).
 * Componente reutilizable: lo usan el catálogo, el detalle y el carrito.
 */
public final class IlustracionPrenda {

    private IlustracionPrenda() {
    }

    public static void aplicar(ImageView imagen, String categoria) {
        imagen.setImageResource(dibujo(categoria));
        imagen.setBackgroundColor(ContextCompat.getColor(imagen.getContext(), colorFondo(categoria)));
    }

    @DrawableRes
    public static int dibujo(String categoria) {
        String c = normalizar(categoria);
        if (c.contains("pijama")) return R.drawable.ic_prenda_pijama;
        if (c.contains("conjunto")) return R.drawable.ic_prenda_conjunto;
        if (c.contains("accesorio")) return R.drawable.ic_prenda_gorro;
        if (c.contains("calzado")) return R.drawable.ic_prenda_zapato;
        return R.drawable.ic_prenda_body;   // Recién nacido, Bodies y cualquier otra
    }

    @ColorRes
    public static int colorFondo(String categoria) {
        String c = normalizar(categoria);
        if (c.contains("recien")) return R.color.fondo_celeste;
        if (c.contains("pijama")) return R.color.fondo_lila;
        if (c.contains("conjunto")) return R.color.fondo_menta;
        if (c.contains("accesorio")) return R.color.fondo_durazno;
        if (c.contains("calzado")) return R.color.fondo_crema;
        return R.color.fondo_rosa;
    }

    private static String normalizar(String texto) {
        if (texto == null) return "";
        return Normalizer.normalize(texto.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }
}
