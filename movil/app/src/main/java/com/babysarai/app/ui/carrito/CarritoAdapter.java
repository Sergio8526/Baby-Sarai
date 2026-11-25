package com.babysarai.app.ui.carrito;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.babysarai.app.R;
import com.babysarai.app.databinding.ItemCarritoBinding;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.ui.comun.IlustracionPrenda;
import com.babysarai.app.util.FormatoMoneda;

/**
 * Adaptador de las líneas del carrito.
 */
public class CarritoAdapter extends ListAdapter<ItemCarrito, CarritoAdapter.ItemViewHolder> {

    /** Acciones que el usuario puede hacer sobre una línea. */
    public interface Acciones {
        void aumentar(ItemCarrito item);
        void disminuir(ItemCarrito item);
        void eliminar(ItemCarrito item);
    }

    private final Acciones acciones;

    public CarritoAdapter(Acciones acciones) {
        super(COMPARADOR);
        this.acciones = acciones;
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ItemViewHolder(ItemCarritoBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        holder.mostrar(getItem(position));
    }

    class ItemViewHolder extends RecyclerView.ViewHolder {
        private final ItemCarritoBinding b;

        ItemViewHolder(ItemCarritoBinding b) {
            super(b.getRoot());
            this.b = b;
        }

        void mostrar(ItemCarrito item) {
            Context ctx = b.getRoot().getContext();
            IlustracionPrenda.aplicar(b.imagenPrenda, item.getCategoriaNombre());
            b.textoNombre.setText(item.getNombre());
            b.textoDetalle.setText(ctx.getString(R.string.formato_talla_precio,
                    item.getTalla(), FormatoMoneda.formatear(item.getPrecioUnitario())));
            b.textoSubtotal.setText(FormatoMoneda.formatear(item.getSubtotal()));
            b.textoCantidad.setText(String.valueOf(item.getCantidad()));
            b.botonMas.setEnabled(item.getCantidad() < item.getStockDisponible());

            b.botonMas.setOnClickListener(v -> acciones.aumentar(item));
            b.botonMenos.setOnClickListener(v -> acciones.disminuir(item));
            b.botonEliminar.setOnClickListener(v -> acciones.eliminar(item));
        }
    }

    private static final DiffUtil.ItemCallback<ItemCarrito> COMPARADOR = new DiffUtil.ItemCallback<ItemCarrito>() {
        @Override
        public boolean areItemsTheSame(@NonNull ItemCarrito viejo, @NonNull ItemCarrito nuevo) {
            return viejo.getProductoId() == nuevo.getProductoId();
        }

        @Override
        public boolean areContentsTheSame(@NonNull ItemCarrito viejo, @NonNull ItemCarrito nuevo) {
            return viejo.getCantidad() == nuevo.getCantidad() && viejo.getPrecioUnitario() == nuevo.getPrecioUnitario();
        }
    };
}
