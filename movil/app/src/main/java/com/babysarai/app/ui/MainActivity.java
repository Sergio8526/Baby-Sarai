package com.babysarai.app.ui;

import android.os.Bundle;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.babysarai.app.R;
import com.babysarai.app.data.repository.CarritoRepository;
import com.babysarai.app.databinding.ActivityMainBinding;
import com.babysarai.app.domain.CalculadoraCarrito;
import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.ui.carrito.CarritoFragment;
import com.babysarai.app.ui.catalogo.CatalogoFragment;
import com.babysarai.app.ui.detalle.DetalleProductoFragment;
import com.babysarai.app.ui.pedido.CheckoutFragment;
import com.babysarai.app.ui.pedido.PedidosFragment;
import com.google.android.material.badge.BadgeDrawable;

import java.util.List;

/**
 * Única actividad de la app (patrón Single Activity).
 * Contiene la barra superior, la barra de navegación inferior y un
 * contenedor donde se cambian los fragments de cada módulo.
 */
public class MainActivity extends AppCompatActivity implements Navegador {

    private static final String PILA_SECCION = "seccion";

    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.toolbar);

        binding.navegacionInferior.setOnItemSelectedListener(item -> {
            mostrarSeccion(item.getItemId());
            return true;
        });
        // Tocar de nuevo la pestaña actual vuelve a su pantalla inicial
        binding.navegacionInferior.setOnItemReselectedListener(item -> limpiarPila());

        getSupportFragmentManager().addOnBackStackChangedListener(this::actualizarBotonAtras);

        // El número de prendas del carrito se actualiza solo (LiveData)
        CarritoRepository.getInstance(this).getItems().observe(this, this::actualizarInsignia);

        if (savedInstanceState == null) {
            binding.navegacionInferior.setSelectedItemId(R.id.nav_catalogo);
        }
        actualizarBotonAtras();
    }

    /** Muestra la pantalla principal de cada pestaña. */
    private void mostrarSeccion(int itemId) {
        limpiarPila();
        Fragment destino;
        if (itemId == R.id.nav_carrito) {
            destino = new CarritoFragment();
        } else if (itemId == R.id.nav_pedidos) {
            destino = new PedidosFragment();
        } else {
            destino = new CatalogoFragment();
        }
        getSupportFragmentManager().beginTransaction()
                .setReorderingAllowed(true)
                .replace(R.id.contenedor, destino)
                .commit();
    }

    /** Abre una pantalla encima de la actual (se puede volver con "atrás"). */
    private void apilar(Fragment fragment) {
        getSupportFragmentManager().beginTransaction()
                .setReorderingAllowed(true)
                .setCustomAnimations(android.R.anim.fade_in, android.R.anim.fade_out,
                        android.R.anim.fade_in, android.R.anim.fade_out)
                .replace(R.id.contenedor, fragment)
                .addToBackStack(PILA_SECCION)
                .commit();
    }

    private void limpiarPila() {
        getSupportFragmentManager().popBackStack(PILA_SECCION, FragmentManager.POP_BACK_STACK_INCLUSIVE);
    }

    private void actualizarBotonAtras() {
        ActionBar barra = getSupportActionBar();
        if (barra != null) {
            barra.setDisplayHomeAsUpEnabled(getSupportFragmentManager().getBackStackEntryCount() > 0);
        }
    }

    private void actualizarInsignia(List<ItemCarrito> items) {
        int cantidad = CalculadoraCarrito.cantidadArticulos(items);
        BadgeDrawable insignia = binding.navegacionInferior.getOrCreateBadge(R.id.nav_carrito);
        insignia.setVisible(cantidad > 0);
        insignia.setNumber(cantidad);
    }

    @Override
    public boolean onSupportNavigateUp() {
        getOnBackPressedDispatcher().onBackPressed();
        return true;
    }

    // ---- Navegador ----

    @Override
    public void mostrarCatalogo() {
        binding.navegacionInferior.setSelectedItemId(R.id.nav_catalogo);
    }

    @Override
    public void abrirDetalle(int productoId) {
        apilar(DetalleProductoFragment.nuevaInstancia(productoId));
    }

    @Override
    public void mostrarCarrito() {
        binding.navegacionInferior.setSelectedItemId(R.id.nav_carrito);
    }

    @Override
    public void abrirCheckout() {
        apilar(new CheckoutFragment());
    }

    @Override
    public void mostrarPedidos() {
        binding.navegacionInferior.setSelectedItemId(R.id.nav_pedidos);
    }
}
