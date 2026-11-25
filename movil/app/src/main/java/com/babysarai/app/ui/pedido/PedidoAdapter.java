package com.babysarai.app.ui.pedido;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.babysarai.app.R;
import com.babysarai.app.databinding.ItemPedidoBinding;
import com.babysarai.app.model.Pedido;
import com.babysarai.app.util.FormatoMoneda;

/**
 * Adaptador del historial de pedidos.
 */
public class PedidoAdapter extends ListAdapter<Pedido, PedidoAdapter.PedidoViewHolder> {

    public PedidoAdapter() {
        super(COMPARADOR);
    }

    @NonNull
    @Override
    public PedidoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new PedidoViewHolder(ItemPedidoBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull PedidoViewHolder holder, int position) {
        holder.mostrar(getItem(position));
    }

    static class PedidoViewHolder extends RecyclerView.ViewHolder {
        private final ItemPedidoBinding b;

        PedidoViewHolder(ItemPedidoBinding b) {
            super(b.getRoot());
            this.b = b;
        }

        void mostrar(Pedido p) {
            Context ctx = b.getRoot().getContext();
            b.textoNumero.setText(ctx.getString(R.string.formato_numero_pedido, p.getId()));
            b.textoEstado.setText(p.getEstado());
            b.textoFecha.setText(p.getFecha());
            b.textoEntrega.setText(ctx.getString(R.string.formato_entrega, p.getDireccion(), p.getCiudad()));
            b.textoPago.setText(p.getMetodoPago());
            b.textoArticulos.setText(ctx.getResources()
                    .getQuantityString(R.plurals.prendas, p.getArticulos(), p.getArticulos()));
            b.textoTotal.setText(FormatoMoneda.formatear(p.getTotal()));
        }
    }

    private static final DiffUtil.ItemCallback<Pedido> COMPARADOR = new DiffUtil.ItemCallback<Pedido>() {
        @Override
        public boolean areItemsTheSame(@NonNull Pedido viejo, @NonNull Pedido nuevo) {
            return viejo.getId() == nuevo.getId();
        }

        @Override
        public boolean areContentsTheSame(@NonNull Pedido viejo, @NonNull Pedido nuevo) {
            return viejo.getEstado().equals(nuevo.getEstado()) && viejo.getTotal() == nuevo.getTotal();
        }
    };
}
