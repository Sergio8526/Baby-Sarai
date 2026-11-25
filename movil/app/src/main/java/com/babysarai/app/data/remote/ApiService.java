package com.babysarai.app.data.remote;

import com.babysarai.app.model.Categoria;
import com.babysarai.app.model.Producto;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * Endpoints de la API REST de Baby Saraí (Node.js + Express + MySQL).
 * Retrofit genera la implementación de esta interfaz en tiempo de ejecución.
 */
public interface ApiService {

    /** GET /api/productos?soloActivos=true */
    @GET("productos")
    Call<List<Producto>> listarProductos(@Query("soloActivos") boolean soloActivos);

    /** GET /api/productos/{id} */
    @GET("productos/{id}")
    Call<Producto> obtenerProducto(@Path("id") int id);

    /** GET /api/categorias?soloActivas=true */
    @GET("categorias")
    Call<List<Categoria>> listarCategorias(@Query("soloActivas") boolean soloActivas);
}
