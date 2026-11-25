package com.babysarai.app.ui.pedido;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.babysarai.app.data.repository.CarritoRepository;
import com.babysarai.app.data.repository.PedidoRepository;
import com.babysarai.app.domain.ValidadorPedido;
import com.babysarai.app.model.DatosEntrega;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.util.Evento;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * ViewModel del formulario de pedido: valida los datos, registra el pedido
 * y vacía el carrito.
 */
public class CheckoutViewModel extends AndroidViewModel {

    private final CarritoRepository carrito;
    private final PedidoRepository pedidos;

    private final MutableLiveData<Map<String, String>> errores = new MutableLiveData<>(Collections.emptyMap());
    private final MutableLiveData<Boolean> procesando = new MutableLiveData<>(false);
    private final MutableLiveData<Evento<Long>> pedidoCreado = new MutableLiveData<>();

    public CheckoutViewModel(@NonNull Application app) {
        super(app);
        carrito = CarritoRepository.getInstance(app);
        pedidos = PedidoRepository.getInstance(app);
    }

    public LiveData<List<ItemCarrito>> getItems() { return carrito.getItems(); }
    public LiveData<Map<String, String>> getErrores() { return errores; }
    public LiveData<Boolean> getProcesando() { return procesando; }
    public LiveData<Evento<Long>> getPedidoCreado() { return pedidoCreado; }

    public void confirmar(DatosEntrega datos) {
        if (Boolean.TRUE.equals(procesando.getValue())) {
            return;   // Evita registrar el pedido dos veces por doble toque
        }
        Map<String, String> encontrados = ValidadorPedido.validar(datos);
        errores.setValue(encontrados);
        if (!encontrados.isEmpty()) {
            return;
        }

        List<ItemCarrito> items = carrito.getItems().getValue();
        if (items == null || items.isEmpty()) {
            return;
        }

        procesando.setValue(true);
        pedidos.crear(datos, items, pedidoId -> {
            // Primero se avisa a la pantalla y después se vacía el carrito
            procesando.postValue(false);
            pedidoCreado.postValue(new Evento<>(pedidoId));
            carrito.vaciar();
        });
    }
}
