package com.babysarai.app.ui.pedido;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.babysarai.app.R;
import com.babysarai.app.databinding.FragmentCheckoutBinding;
import com.babysarai.app.domain.CalculadoraCarrito;
import com.babysarai.app.domain.ValidadorPedido;
import com.babysarai.app.model.DatosEntrega;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.ui.Navegador;
import com.babysarai.app.util.FormatoMoneda;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.List;
import java.util.Map;

/**
 * Módulo 4 — Pedido (checkout).
 * Formulario de datos de entrega y método de pago, con validaciones y resumen.
 */
public class CheckoutFragment extends Fragment {

    private FragmentCheckoutBinding binding;
    private CheckoutViewModel viewModel;
    private boolean pedidoRegistrado = false;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentCheckoutBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(CheckoutViewModel.class);

        // El texto de cada opción es el mismo que valida ValidadorPedido
        binding.radioContraentrega.setText(ValidadorPedido.METODOS_PAGO.get(0));
        binding.radioTransferencia.setText(ValidadorPedido.METODOS_PAGO.get(1));
        binding.radioTarjeta.setText(ValidadorPedido.METODOS_PAGO.get(2));

        binding.botonConfirmar.setOnClickListener(v -> viewModel.confirmar(leerFormulario()));

        viewModel.getItems().observe(getViewLifecycleOwner(), this::mostrarResumen);
        viewModel.getErrores().observe(getViewLifecycleOwner(), this::mostrarErrores);
        viewModel.getProcesando().observe(getViewLifecycleOwner(), procesando -> {
            boolean activo = Boolean.TRUE.equals(procesando);
            binding.progreso.setVisibility(activo ? View.VISIBLE : View.GONE);
            binding.botonConfirmar.setEnabled(!activo);
        });
        viewModel.getPedidoCreado().observe(getViewLifecycleOwner(), evento -> {
            Long id = evento.obtenerSiNoUsado();
            if (id != null) {
                pedidoRegistrado = true;
                mostrarConfirmacion(id);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        requireActivity().setTitle(R.string.titulo_checkout);
    }

    private DatosEntrega leerFormulario() {
        String metodo = "";
        int seleccionado = binding.grupoPago.getCheckedRadioButtonId();
        if (seleccionado != View.NO_ID) {
            RadioButton radio = binding.getRoot().findViewById(seleccionado);
            metodo = radio.getText().toString();
        }
        return new DatosEntrega(
                texto(binding.campoNombre.getText()),
                texto(binding.campoTelefono.getText()),
                texto(binding.campoDireccion.getText()),
                texto(binding.campoCiudad.getText()),
                metodo);
    }

    private static String texto(CharSequence valor) {
        return valor == null ? "" : valor.toString();
    }

    private void mostrarErrores(Map<String, String> errores) {
        binding.capaNombre.setError(errores.get(ValidadorPedido.CAMPO_NOMBRE));
        binding.capaTelefono.setError(errores.get(ValidadorPedido.CAMPO_TELEFONO));
        binding.capaDireccion.setError(errores.get(ValidadorPedido.CAMPO_DIRECCION));
        binding.capaCiudad.setError(errores.get(ValidadorPedido.CAMPO_CIUDAD));

        String errorPago = errores.get(ValidadorPedido.CAMPO_PAGO);
        binding.textoErrorPago.setVisibility(errorPago == null ? View.GONE : View.VISIBLE);
        binding.textoErrorPago.setText(errorPago);
    }

    private void mostrarResumen(List<ItemCarrito> items) {
        if ((items == null || items.isEmpty()) && !pedidoRegistrado) {
            binding.botonConfirmar.setEnabled(false);
            binding.textoResumenArticulos.setText(R.string.carrito_vacio);
            return;
        }
        if (items == null || items.isEmpty()) {
            return;   // Se acaba de vaciar al registrar el pedido: se deja el resumen anterior
        }
        double subtotal = CalculadoraCarrito.subtotal(items);
        double envio = CalculadoraCarrito.envio(subtotal);
        int articulos = CalculadoraCarrito.cantidadArticulos(items);

        binding.textoResumenArticulos.setText(getResources()
                .getQuantityString(R.plurals.prendas, articulos, articulos));
        binding.textoSubtotal.setText(FormatoMoneda.formatear(subtotal));
        binding.textoEnvio.setText(envio == 0 ? getString(R.string.gratis) : FormatoMoneda.formatear(envio));
        binding.textoTotal.setText(FormatoMoneda.formatear(subtotal + envio));
    }

    private void mostrarConfirmacion(long pedidoId) {
        new MaterialAlertDialogBuilder(requireContext())
                .setTitle(R.string.pedido_registrado_titulo)
                .setMessage(getString(R.string.pedido_registrado_mensaje, pedidoId))
                .setCancelable(false)
                .setPositiveButton(R.string.ver_mis_pedidos,
                        (dialogo, boton) -> ((Navegador) requireActivity()).mostrarPedidos())
                .show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
