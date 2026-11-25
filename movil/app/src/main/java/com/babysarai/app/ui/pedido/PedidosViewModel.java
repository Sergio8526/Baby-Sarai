package com.babysarai.app.ui.pedido;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.babysarai.app.data.repository.PedidoRepository;
import com.babysarai.app.model.Pedido;

import java.util.List;

/**
 * ViewModel del historial de pedidos.
 */
public class PedidosViewModel extends AndroidViewModel {

    private final PedidoRepository repositorio;

    public PedidosViewModel(@NonNull Application app) {
        super(app);
        repositorio = PedidoRepository.getInstance(app);
        repositorio.refrescar();
    }

    public LiveData<List<Pedido>> getPedidos() {
        return repositorio.getPedidos();
    }
}
