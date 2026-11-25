package com.babysarai.app.ui.pedido;

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
import com.babysarai.app.databinding.FragmentPedidosBinding;
import com.babysarai.app.ui.Navegador;

/**
 * Módulo 4 — Mis pedidos: historial de pedidos guardados en el teléfono.
 */
public class PedidosFragment extends Fragment {

    private FragmentPedidosBinding binding;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentPedidosBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        PedidosViewModel viewModel = new ViewModelProvider(this).get(PedidosViewModel.class);

        PedidoAdapter adapter = new PedidoAdapter();
        binding.listaPedidos.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.listaPedidos.setAdapter(adapter);
        binding.botonVerCatalogo.setOnClickListener(v -> ((Navegador) requireActivity()).mostrarCatalogo());

        viewModel.getPedidos().observe(getViewLifecycleOwner(), pedidos -> {
            adapter.submitList(pedidos);
            boolean vacio = pedidos.isEmpty();
            binding.listaPedidos.setVisibility(vacio ? View.GONE : View.VISIBLE);
            binding.grupoVacio.setVisibility(vacio ? View.VISIBLE : View.GONE);
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        requireActivity().setTitle(R.string.titulo_pedidos);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
