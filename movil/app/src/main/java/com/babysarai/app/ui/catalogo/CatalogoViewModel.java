package com.babysarai.app.ui.catalogo;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.babysarai.app.data.repository.ProductoRepository;
import com.babysarai.app.domain.FiltroCatalogo;
import com.babysarai.app.model.Categoria;
import com.babysarai.app.model.Producto;

import java.util.ArrayList;
import java.util.List;

/**
 * ViewModel del catálogo (patrón MVVM).
 * Guarda el estado de la pantalla (productos, filtros, cargando) y
 * sobrevive a los cambios de configuración, como girar el teléfono.
 */
public class CatalogoViewModel extends ViewModel {

    private final ProductoRepository repositorio;

    private final MutableLiveData<Boolean> cargando = new MutableLiveData<>(false);
    private final MutableLiveData<List<Producto>> productos = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<List<Categoria>> categorias = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<String> aviso = new MutableLiveData<>(null);

    private List<Producto> todos = new ArrayList<>();
    private Integer categoriaSeleccionada = null;
    private String textoBuscado = "";

    public CatalogoViewModel() {
        repositorio = ProductoRepository.getInstance();
        cargar();
    }

    public LiveData<Boolean> getCargando() { return cargando; }
    public LiveData<List<Producto>> getProductos() { return productos; }
    public LiveData<List<Categoria>> getCategorias() { return categorias; }
    /** Mensaje de modo sin conexión; null cuando los datos vienen del servidor. */
    public LiveData<String> getAviso() { return aviso; }
    public Integer getCategoriaSeleccionada() { return categoriaSeleccionada; }

    public void cargar() {
        cargando.setValue(true);
        repositorio.listarCategorias(resultado -> categorias.setValue(resultado.getDatos()));
        repositorio.listarProductos(resultado -> {
            cargando.setValue(false);
            todos = resultado.getDatos();
            aviso.setValue(resultado.isDesdeServidor() ? null : resultado.getMensaje());
            aplicarFiltros();
        });
    }

    public void filtrarPorCategoria(Integer categoriaId) {
        categoriaSeleccionada = categoriaId;
        aplicarFiltros();
    }

    public void buscar(String texto) {
        textoBuscado = texto;
        aplicarFiltros();
    }

    private void aplicarFiltros() {
        productos.setValue(FiltroCatalogo.filtrar(todos, categoriaSeleccionada, textoBuscado));
    }
}
