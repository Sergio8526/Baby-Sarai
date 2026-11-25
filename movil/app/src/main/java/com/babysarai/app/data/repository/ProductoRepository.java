package com.babysarai.app.data.repository;

import androidx.annotation.NonNull;

import com.babysarai.app.data.remote.ApiService;
import com.babysarai.app.data.remote.RetrofitClient;
import com.babysarai.app.model.Categoria;
import com.babysarai.app.model.Producto;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repositorio del catálogo (patrón Repository).
 *
 * Es el único punto de la app que sabe de dónde salen los productos:
 * primero los pide a la API; si el servidor no responde, entrega los
 * datos de demostración e informa que la app está en modo sin conexión.
 * Los ViewModel no saben si hablan con internet o con datos locales.
 */
public class ProductoRepository {

    /** Respuesta asíncrona del repositorio. Se ejecuta en el hilo principal. */
    public interface AlResponder<T> {
        void con(Resultado<T> resultado);
    }

    private static final String SIN_CONEXION =
            "Sin conexión con el servidor. Se muestran productos de demostración.";

    private static volatile ProductoRepository instancia;
    private final ApiService api;

    private ProductoRepository(ApiService api) {
        this.api = api;
    }

    public static ProductoRepository getInstance() {
        if (instancia == null) {
            synchronized (ProductoRepository.class) {
                if (instancia == null) {
                    instancia = new ProductoRepository(RetrofitClient.getApi());
                }
            }
        }
        return instancia;
    }

    public void listarProductos(AlResponder<List<Producto>> respuesta) {
        api.listarProductos(true).enqueue(new Callback<List<Producto>>() {
            @Override
            public void onResponse(@NonNull Call<List<Producto>> call, @NonNull Response<List<Producto>> r) {
                if (r.isSuccessful() && r.body() != null) {
                    respuesta.con(Resultado.delServidor(r.body()));
                } else {
                    respuesta.con(Resultado.deRespaldo(DatosDemo.productos(),
                            "El servidor respondió con el código " + r.code()
                                    + ". Se muestran productos de demostración."));
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Producto>> call, @NonNull Throwable t) {
                respuesta.con(Resultado.deRespaldo(DatosDemo.productos(), SIN_CONEXION));
            }
        });
    }

    public void listarCategorias(AlResponder<List<Categoria>> respuesta) {
        api.listarCategorias(true).enqueue(new Callback<List<Categoria>>() {
            @Override
            public void onResponse(@NonNull Call<List<Categoria>> call, @NonNull Response<List<Categoria>> r) {
                if (r.isSuccessful() && r.body() != null) {
                    respuesta.con(Resultado.delServidor(r.body()));
                } else {
                    respuesta.con(Resultado.deRespaldo(DatosDemo.categorias(), SIN_CONEXION));
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Categoria>> call, @NonNull Throwable t) {
                respuesta.con(Resultado.deRespaldo(DatosDemo.categorias(), SIN_CONEXION));
            }
        });
    }

    public void obtenerProducto(int id, AlResponder<Producto> respuesta) {
        api.obtenerProducto(id).enqueue(new Callback<Producto>() {
            @Override
            public void onResponse(@NonNull Call<Producto> call, @NonNull Response<Producto> r) {
                if (r.isSuccessful() && r.body() != null) {
                    respuesta.con(Resultado.delServidor(r.body()));
                } else if (r.code() == 404) {
                    respuesta.con(Resultado.error("Este producto ya no está disponible."));
                } else {
                    respuesta.con(Resultado.error("No se pudo cargar el producto (código " + r.code() + ")."));
                }
            }

            @Override
            public void onFailure(@NonNull Call<Producto> call, @NonNull Throwable t) {
                Producto demo = DatosDemo.buscarProducto(id);
                if (demo != null) {
                    respuesta.con(Resultado.deRespaldo(demo, SIN_CONEXION));
                } else {
                    respuesta.con(Resultado.error("No hay conexión con el servidor."));
                }
            }
        });
    }
}
