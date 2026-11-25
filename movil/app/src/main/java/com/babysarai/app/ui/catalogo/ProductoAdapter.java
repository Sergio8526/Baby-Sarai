package com.babysarai.app.ui.catalogo;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.babysarai.app.R;
import com.babysarai.app.databinding.ItemProductoBinding;
import com.babysarai.app.model.Producto;
import com.babysarai.app.ui.comun.IlustracionPrenda;
import com.babysarai.app.util.FormatoMoneda;

/**
 * Adaptador de la cuadrícula del catálogo (patrones Adapter y ViewHolder).
 * ListAdapter + DiffUtil calcula qué tarjetas cambiaron y solo redibuja esas.
 */
public class ProductoAdapter extends ListAdapter<Producto, ProductoAdapter.ProductoViewHolder> {

    public interface AlTocarProducto {
        void abrir(Producto producto);
    }

    private final AlTocarProducto alTocar;

    public ProductoAdapter(AlTocarProducto alTocar) {
        super(COMPARADOR);
        this.alTocar = alTocar;
    }

    @NonNull
    @Override
    public ProductoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProductoBinding b = ItemProductoBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new ProductoViewHolder(b);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductoViewHolder holder, int position) {
        holder.mostrar(getItem(position));
    }

    class ProductoViewHolder extends RecyclerView.ViewHolder {
        private final ItemProductoBinding b;

        ProductoViewHolder(ItemProductoBinding b) {
            super(b.getRoot());
            this.b = b;
        }

        void mostrar(Producto p) {
            IlustracionPrenda.aplicar(b.imagenPrenda, p.getCategoriaNombre());
            b.textoNombre.setText(p.getNombre());
            b.textoDetalle.setText(b.getRoot().getContext()
                    .getString(R.string.formato_talla_estado, p.getTalla(), p.getEstadoTexto()));
            b.textoPrecio.setText(FormatoMoneda.formatear(p.getPrecio()));

            if (!p.estaDisponible()) {
                b.etiquetaEstado.setVisibility(View.VISIBLE);
                b.etiquetaEstado.setText(R.string.agotado);
                b.etiquetaEstado.setBackgroundResource(R.drawable.fondo_etiqueta_agotado);
            } else if (p.esUsado()) {
                b.etiquetaEstado.setVisibility(View.VISIBLE);
                b.etiquetaEstado.setText(R.string.segunda_mano);
                b.etiquetaEstado.setBackgroundResource(R.drawable.fondo_etiqueta);
            } else {
                b.etiquetaEstado.setVisibility(View.GONE);
            }

            b.getRoot().setOnClickListener(v -> alTocar.abrir(p));
        }
    }

    private static final DiffUtil.ItemCallback<Producto> COMPARADOR = new DiffUtil.ItemCallback<Producto>() {
        @Override
        public boolean areItemsTheSame(@NonNull Producto viejo, @NonNull Producto nuevo) {
            return viejo.getId() == nuevo.getId();
        }

        @Override
        public boolean areContentsTheSame(@NonNull Producto viejo, @NonNull Producto nuevo) {
            return viejo.getPrecio() == nuevo.getPrecio()
                    && viejo.getStock() == nuevo.getStock()
                    && viejo.getNombre().equals(nuevo.getNombre());
        }
    };
}
