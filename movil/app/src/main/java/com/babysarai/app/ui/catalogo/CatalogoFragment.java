package com.babysarai.app.ui.catalogo;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;

import com.babysarai.app.R;
import com.babysarai.app.databinding.FragmentCatalogoBinding;
import com.babysarai.app.model.Categoria;
import com.babysarai.app.ui.Navegador;
import com.google.android.material.chip.Chip;

import java.util.List;

/**
 * Módulo 1 — Catálogo.
 * Muestra los productos en cuadrícula, con búsqueda y filtro por categoría.
 */
public class CatalogoFragment extends Fragment {

    private FragmentCatalogoBinding binding;
    private CatalogoViewModel viewModel;
    private ProductoAdapter adapter;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentCatalogoBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(CatalogoViewModel.class);

        adapter = new ProductoAdapter(producto -> ((Navegador) requireActivity()).abrirDetalle(producto.getId()));
        binding.listaProductos.setLayoutManager(new GridLayoutManager(requireContext(), 2));
        binding.listaProductos.setAdapter(adapter);

        binding.campoBusqueda.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) { }
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) { }
            @Override public void afterTextChanged(Editable s) { viewModel.buscar(s.toString()); }
        });

        binding.grupoCategorias.setOnCheckedStateChangeListener((grupo, ids) -> {
            if (ids.isEmpty()) return;
            Object etiqueta = grupo.findViewById(ids.get(0)).getTag();
            viewModel.filtrarPorCategoria((Integer) etiqueta);   // null = Todas
        });

        binding.botonReintentar.setOnClickListener(v -> viewModel.cargar());

        viewModel.getCargando().observe(getViewLifecycleOwner(), cargando ->
                binding.progreso.setVisibility(Boolean.TRUE.equals(cargando) ? View.VISIBLE : View.GONE));

        viewModel.getProductos().observe(getViewLifecycleOwner(), lista -> {
            adapter.submitList(lista);
            binding.textoVacio.setVisibility(lista.isEmpty() ? View.VISIBLE : View.GONE);
            binding.textoResultados.setText(getResources()
                    .getQuantityString(R.plurals.resultados, lista.size(), lista.size()));
        });

        viewModel.getCategorias().observe(getViewLifecycleOwner(), this::mostrarCategorias);

        viewModel.getAviso().observe(getViewLifecycleOwner(), aviso -> {
            binding.tarjetaAviso.setVisibility(aviso == null ? View.GONE : View.VISIBLE);
            binding.textoAviso.setText(aviso);
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        requireActivity().setTitle(R.string.titulo_catalogo);
    }

    /** Crea un chip por categoría, más el chip "Todas". */
    private void mostrarCategorias(List<Categoria> categorias) {
        binding.grupoCategorias.removeAllViews();
        Integer seleccionada = viewModel.getCategoriaSeleccionada();
        agregarChip(getString(R.string.todas), null, seleccionada == null);
        for (Categoria c : categorias) {
            agregarChip(c.getNombre(), c.getId(), seleccionada != null && seleccionada == c.getId());
        }
    }

    private void agregarChip(String texto, Integer categoriaId, boolean marcado) {
        Chip chip = (Chip) getLayoutInflater().inflate(R.layout.item_chip_categoria, binding.grupoCategorias, false);
        chip.setId(View.generateViewId());
        chip.setText(texto);
        chip.setTag(categoriaId);
        binding.grupoCategorias.addView(chip);
        chip.setChecked(marcado);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;   // Evita fugas de memoria: la vista se destruye antes que el fragment
    }
}
