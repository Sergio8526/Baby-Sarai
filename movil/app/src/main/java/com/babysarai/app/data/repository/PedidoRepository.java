package com.babysarai.app.data.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.babysarai.app.data.local.BabySaraiDbHelper;
import com.babysarai.app.data.local.PedidoDao;
import com.babysarai.app.domain.CalculadoraCarrito;
import com.babysarai.app.model.DatosEntrega;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.model.Pedido;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Repositorio de pedidos: registra pedidos y entrega el historial.
 */
public class PedidoRepository {

    /** Aviso con el número del pedido creado. Se llama desde el hilo de fondo. */
    public interface AlCrear {
        void con(long pedidoId);
    }

    private static volatile PedidoRepository instancia;

    private final PedidoDao dao;
    private final ExecutorService hiloFondo = Executors.newSingleThreadExecutor();
    private final MutableLiveData<List<Pedido>> pedidos = new MutableLiveData<>(new ArrayList<>());

    private PedidoRepository(Context context) {
        dao = new PedidoDao(BabySaraiDbHelper.getInstance(context));
    }

    public static PedidoRepository getInstance(Context context) {
        if (instancia == null) {
            synchronized (PedidoRepository.class) {
                if (instancia == null) {
                    instancia = new PedidoRepository(context.getApplicationContext());
                }
            }
        }
        return instancia;
    }

    public LiveData<List<Pedido>> getPedidos() {
        return pedidos;
    }

    public void refrescar() {
        hiloFondo.execute(() -> pedidos.postValue(dao.listar()));
    }

    /** Calcula los totales con las reglas del carrito y guarda el pedido. */
    public void crear(DatosEntrega datos, List<ItemCarrito> items, AlCrear aviso) {
        List<ItemCarrito> copia = new ArrayList<>(items);
        hiloFondo.execute(() -> {
            double subtotal = CalculadoraCarrito.subtotal(copia);
            double envio = CalculadoraCarrito.envio(subtotal);
            String fecha = new SimpleDateFormat("dd/MM/yyyy HH:mm", new Locale("es", "CO")).format(new Date());

            Pedido pedido = new Pedido(0, fecha, datos.getNombre(), datos.getTelefono(),
                    datos.getDireccion(), datos.getCiudad(), datos.getMetodoPago(),
                    subtotal, envio, subtotal + envio,
                    CalculadoraCarrito.cantidadArticulos(copia), Pedido.ESTADO_RECIBIDO);

            long id = dao.crear(pedido, copia);
            pedidos.postValue(dao.listar());
            if (aviso != null) {
                aviso.con(id);
            }
        });
    }
}
