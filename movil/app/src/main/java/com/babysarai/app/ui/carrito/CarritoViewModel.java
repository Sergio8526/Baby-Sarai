package com.babysarai.app.ui.carrito;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.babysarai.app.data.repository.CarritoRepository;
import com.babysarai.app.model.ItemCarrito;

import java.util.List;

/**
 * ViewModel del carrito. Delega en el repositorio, que es quien guarda en SQLite.
 */
public class CarritoViewModel extends AndroidViewModel {

    private final CarritoRepository repositorio;

    public CarritoViewModel(@NonNull Application app) {
        super(app);
        repositorio = CarritoRepository.getInstance(app);
    }

    public LiveData<List<ItemCarrito>> getItems() {
        return repositorio.getItems();
    }

    public void aumentar(ItemCarrito item) {
        if (item.getCantidad() < item.getStockDisponible()) {
            repositorio.cambiarCantidad(item, item.getCantidad() + 1);
        }
    }

    public void disminuir(ItemCarrito item) {
        repositorio.cambiarCantidad(item, item.getCantidad() - 1);   // En 0 se elimina
    }

    public void eliminar(ItemCarrito item) {
        repositorio.eliminar(item);
    }

    public void deshacerEliminar(ItemCarrito item) {
        repositorio.cambiarCantidad(item, item.getCantidad());
    }
}
