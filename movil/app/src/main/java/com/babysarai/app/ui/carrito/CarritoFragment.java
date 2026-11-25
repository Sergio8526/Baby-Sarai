package com.babysarai.app.ui.carrito;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.babysarai.app.R;
import com.babysarai.app.databinding.FragmentCarritoBinding;
import com.babysarai.app.domain.CalculadoraCarrito;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.ui.Navegador;
import com.babysarai.app.util.FormatoMoneda;
import com.google.android.material.snackbar.Snackbar;

import java.util.List;

/**
 * Módulo 3 — Carrito de compras.
 * Lista las prendas elegidas, permite cambiar cantidades o eliminar y
 * muestra subtotal, envío y total con las reglas de CalculadoraCarrito.
 */
public class CarritoFragment extends Fragment {

    private FragmentCarritoBinding binding;
    private CarritoViewModel viewModel;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentCarritoBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(CarritoViewModel.class);

        CarritoAdapter adapter = new CarritoAdapter(new CarritoAdapter.Acciones() {
            @Override public void aumentar(ItemCarrito item) { viewModel.aumentar(item); }
            @Override public void disminuir(ItemCarrito item) { viewModel.disminuir(item); }
            @Override public void eliminar(ItemCarrito item) { eliminarConDeshacer(item); }
        });
        binding.listaCarrito.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.listaCarrito.setAdapter(adapter);

        Navegador navegador = (Navegador) requireActivity();
        binding.botonContinuar.setOnClickListener(v -> navegador.abrirCheckout());
        binding.botonVerCatalogo.setOnClickListener(v -> navegador.mostrarCatalogo());

        viewModel.getItems().observe(getViewLifecycleOwner(), items -> {
            adapter.submitList(items);
            mostrarTotales(items);
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        requireActivity().setTitle(R.string.titulo_carrito);
    }

    private void mostrarTotales(List<ItemCarrito> items) {
        boolean vacio = items == null || items.isEmpty();
        binding.grupoContenido.setVisibility(vacio ? View.GONE : View.VISIBLE);
        binding.grupoVacio.setVisibility(vacio ? View.VISIBLE : View.GONE);
        if (vacio) {
            return;
        }

        double subtotal = CalculadoraCarrito.subtotal(items);
        double envio = CalculadoraCarrito.envio(subtotal);
        double falta = CalculadoraCarrito.faltaParaEnvioGratis(subtotal);

        binding.textoSubtotal.setText(FormatoMoneda.formatear(subtotal));
        binding.textoEnvio.setText(envio == 0 ? getString(R.string.gratis) : FormatoMoneda.formatear(envio));
        binding.textoTotal.setText(FormatoMoneda.formatear(subtotal + envio));
        binding.textoMensajeEnvio.setText(falta > 0
                ? getString(R.string.falta_envio_gratis, FormatoMoneda.formatear(falta))
                : getString(R.string.tienes_envio_gratis));
    }

    private void eliminarConDeshacer(ItemCarrito item) {
        viewModel.eliminar(item);
        Snackbar.make(binding.getRoot(), getString(R.string.producto_eliminado, item.getNombre()), Snackbar.LENGTH_LONG)
                .setAction(R.string.deshacer, v -> viewModel.deshacerEliminar(item))
                .show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
