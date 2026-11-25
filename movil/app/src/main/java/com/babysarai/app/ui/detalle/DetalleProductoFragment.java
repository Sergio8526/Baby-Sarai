package com.babysarai.app.ui.detalle;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.babysarai.app.R;
import com.babysarai.app.databinding.FragmentDetalleProductoBinding;
import com.babysarai.app.model.Producto;
import com.babysarai.app.ui.Navegador;
import com.babysarai.app.ui.comun.IlustracionPrenda;
import com.babysarai.app.util.FormatoMoneda;
import com.google.android.material.snackbar.Snackbar;

/**
 * Módulo 2 — Detalle de producto.
 * Recibe el id del producto como argumento (patrón Factory Method: nuevaInstancia).
 */
public class DetalleProductoFragment extends Fragment {

    private static final String ARG_PRODUCTO_ID = "producto_id";

    private FragmentDetalleProductoBinding binding;
    private DetalleViewModel viewModel;

    public static DetalleProductoFragment nuevaInstancia(int productoId) {
        DetalleProductoFragment fragment = new DetalleProductoFragment();
        Bundle argumentos = new Bundle();
        argumentos.putInt(ARG_PRODUCTO_ID, productoId);
        fragment.setArguments(argumentos);
        return fragment;
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentDetalleProductoBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(DetalleViewModel.class);
        viewModel.cargar(requireArguments().getInt(ARG_PRODUCTO_ID));

        binding.botonMas.setOnClickListener(v -> viewModel.aumentar());
        binding.botonMenos.setOnClickListener(v -> viewModel.disminuir());
        binding.botonAgregar.setOnClickListener(v -> viewModel.agregarAlCarrito());

        viewModel.getCargando().observe(getViewLifecycleOwner(), cargando ->
                binding.progreso.setVisibility(Boolean.TRUE.equals(cargando) ? View.VISIBLE : View.GONE));

        viewModel.getError().observe(getViewLifecycleOwner(), error -> {
            binding.textoError.setVisibility(error == null ? View.GONE : View.VISIBLE);
            binding.textoError.setText(error);
        });

        viewModel.getProducto().observe(getViewLifecycleOwner(), this::mostrarProducto);

        viewModel.getCantidad().observe(getViewLifecycleOwner(), cantidad ->
                binding.textoCantidad.setText(String.valueOf(cantidad)));

        viewModel.getMensaje().observe(getViewLifecycleOwner(), evento -> {
            String texto = evento.obtenerSiNoUsado();
            if (texto != null) {
                Snackbar.make(binding.getRoot(), texto, Snackbar.LENGTH_LONG)
                        .setAction(R.string.ver_carrito, v -> ((Navegador) requireActivity()).mostrarCarrito())
                        .show();
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        requireActivity().setTitle(R.string.titulo_detalle);
    }

    private void mostrarProducto(Producto p) {
        binding.contenido.setVisibility(View.VISIBLE);
        IlustracionPrenda.aplicar(binding.imagenPrenda, p.getCategoriaNombre());
        binding.textoCategoria.setText(p.getCategoriaNombre());
        binding.textoNombre.setText(p.getNombre());
        binding.textoPrecio.setText(FormatoMoneda.formatear(p.getPrecio()));
        binding.textoTalla.setText(getString(R.string.formato_talla, p.getTalla()));
        binding.textoEstado.setText(p.getEstadoTexto());
        binding.textoDescripcion.setText(p.getDescripcion());

        boolean disponible = p.estaDisponible();
        binding.textoStock.setText(disponible
                ? getResources().getQuantityString(R.plurals.unidades_disponibles, p.getStock(), p.getStock())
                : getString(R.string.agotado));
        binding.botonAgregar.setEnabled(disponible);
        binding.botonMas.setEnabled(disponible);
        binding.botonMenos.setEnabled(disponible);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
