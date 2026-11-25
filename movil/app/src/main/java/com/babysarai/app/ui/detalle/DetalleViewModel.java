package com.babysarai.app.ui.detalle;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.babysarai.app.data.repository.CarritoRepository;
import com.babysarai.app.data.repository.ProductoRepository;
import com.babysarai.app.model.Producto;
import com.babysarai.app.util.Evento;

/**
 * ViewModel del detalle de producto: carga el producto, controla la
 * cantidad elegida y lo agrega al carrito.
 */
public class DetalleViewModel extends AndroidViewModel {

    private final ProductoRepository productos = ProductoRepository.getInstance();
    private final CarritoRepository carrito;

    private final MutableLiveData<Producto> producto = new MutableLiveData<>();
    private final MutableLiveData<Boolean> cargando = new MutableLiveData<>(false);
    private final MutableLiveData<String> error = new MutableLiveData<>(null);
    private final MutableLiveData<Integer> cantidad = new MutableLiveData<>(1);
    private final MutableLiveData<Evento<String>> mensaje = new MutableLiveData<>();

    public DetalleViewModel(@NonNull Application app) {
        super(app);
        carrito = CarritoRepository.getInstance(app);
    }

    public LiveData<Producto> getProducto() { return producto; }
    public LiveData<Boolean> getCargando() { return cargando; }
    public LiveData<String> getError() { return error; }
    public LiveData<Integer> getCantidad() { return cantidad; }
    public LiveData<Evento<String>> getMensaje() { return mensaje; }

    /** Carga el producto solo la primera vez (no al girar la pantalla). */
    public void cargar(int productoId) {
        if (producto.getValue() != null || Boolean.TRUE.equals(cargando.getValue())) {
            return;
        }
        cargando.setValue(true);
        productos.obtenerProducto(productoId, resultado -> {
            cargando.setValue(false);
            if (resultado.tieneDatos()) {
                producto.setValue(resultado.getDatos());
                error.setValue(null);
            } else {
                error.setValue(resultado.getMensaje());
            }
        });
    }

    public void aumentar() {
        Producto p = producto.getValue();
        int actual = valorCantidad();
        if (p != null && actual < p.getStock()) {
            cantidad.setValue(actual + 1);
        }
    }

    public void disminuir() {
        int actual = valorCantidad();
        if (actual > 1) {
            cantidad.setValue(actual - 1);
        }
    }

    public void agregarAlCarrito() {
        Producto p = producto.getValue();
        if (p == null) {
            return;
        }
        if (!p.estaDisponible()) {
            mensaje.setValue(new Evento<>("Este producto está agotado"));
            return;
        }
        // El repositorio responde desde un hilo de fondo: por eso postValue
        carrito.agregar(p, valorCantidad(), texto -> mensaje.postValue(new Evento<>(texto)));
    }

    private int valorCantidad() {
        Integer c = cantidad.getValue();
        return c == null ? 1 : c;
    }
}
