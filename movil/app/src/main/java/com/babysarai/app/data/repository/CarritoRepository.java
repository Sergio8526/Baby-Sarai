package com.babysarai.app.data.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.babysarai.app.data.local.BabySaraiDbHelper;
import com.babysarai.app.data.local.CarritoDao;
import com.babysarai.app.domain.CalculadoraCarrito;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.model.Producto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Repositorio del carrito. Guarda las líneas en SQLite y expone la lista
 * como LiveData: cualquier pantalla que la observe (el carrito, el ícono
 * con el número de prendas, el checkout) se actualiza sola (patrón Observer).
 *
 * Las operaciones de base de datos se hacen en un hilo de fondo para no
 * congelar la pantalla.
 */
public class CarritoRepository {

    /** Aviso de resultado. Se llama desde el hilo de fondo. */
    public interface AlTerminar {
        void con(String mensaje);
    }

    private static volatile CarritoRepository instancia;

    private final CarritoDao dao;
    private final ExecutorService hiloFondo = Executors.newSingleThreadExecutor();
    private final MutableLiveData<List<ItemCarrito>> items = new MutableLiveData<>(new ArrayList<>());

    private CarritoRepository(Context context) {
        dao = new CarritoDao(BabySaraiDbHelper.getInstance(context));
        refrescar();
    }

    public static CarritoRepository getInstance(Context context) {
        if (instancia == null) {
            synchronized (CarritoRepository.class) {
                if (instancia == null) {
                    instancia = new CarritoRepository(context.getApplicationContext());
                }
            }
        }
        return instancia;
    }

    public LiveData<List<ItemCarrito>> getItems() {
        return items;
    }

    public void refrescar() {
        hiloFondo.execute(() -> items.postValue(dao.listar()));
    }

    /** Agrega unidades de un producto sin superar el stock disponible. */
    public void agregar(Producto producto, int cantidad, AlTerminar aviso) {
        hiloFondo.execute(() -> {
            ItemCarrito existente = dao.buscar(producto.getId());
            int enCarrito = existente == null ? 0 : existente.getCantidad();
            int nuevaCantidad = CalculadoraCarrito.cantidadPermitida(enCarrito, cantidad, producto.getStock());
            int agregadas = nuevaCantidad - enCarrito;

            String mensaje;
            if (agregadas <= 0) {
                mensaje = "Ya tienes en el carrito todas las unidades disponibles (" + producto.getStock() + ")";
            } else {
                dao.guardar(ItemCarrito.desdeProducto(producto, nuevaCantidad));
                mensaje = agregadas < cantidad
                        ? "Solo se agregaron " + agregadas + " unidades por el stock disponible"
                        : "Se agregó al carrito";
            }
            items.postValue(dao.listar());
            if (aviso != null) {
                aviso.con(mensaje);
            }
        });
    }

    /** Cambia la cantidad de una línea; si llega a cero, la elimina. */
    public void cambiarCantidad(ItemCarrito item, int nuevaCantidad) {
        hiloFondo.execute(() -> {
            if (nuevaCantidad <= 0) {
                dao.eliminar(item.getProductoId());
            } else {
                int permitida = Math.min(nuevaCantidad, item.getStockDisponible());
                dao.guardar(item.conCantidad(permitida));
            }
            items.postValue(dao.listar());
        });
    }

    public void eliminar(ItemCarrito item) {
        hiloFondo.execute(() -> {
            dao.eliminar(item.getProductoId());
            items.postValue(dao.listar());
        });
    }

    public void vaciar() {
        hiloFondo.execute(() -> {
            dao.vaciar();
            items.postValue(new ArrayList<>());
        });
    }
}
