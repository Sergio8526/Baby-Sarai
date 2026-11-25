package com.babysarai.app.data.local;

import static com.babysarai.app.data.local.BabySaraiDbHelper.C_ARTICULOS;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_CANTIDAD;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_CIUDAD;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_CLIENTE;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_DIRECCION;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_ENVIO;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_ESTADO;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_FECHA;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_ID;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_METODO_PAGO;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_NOMBRE;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_PEDIDO_ID;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_PRECIO;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_PRODUCTO_ID;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_SUBTOTAL;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_TELEFONO;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_TOTAL;
import static com.babysarai.app.data.local.BabySaraiDbHelper.T_DETALLE;
import static com.babysarai.app.data.local.BabySaraiDbHelper.T_PEDIDOS;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.babysarai.app.model.ItemCarrito;
import com.babysarai.app.model.Pedido;

import java.util.ArrayList;
import java.util.List;

/**
 * DAO de las tablas pedidos y pedido_detalle.
 */
public class PedidoDao {

    private final BabySaraiDbHelper helper;

    public PedidoDao(BabySaraiDbHelper helper) {
        this.helper = helper;
    }

    /**
     * Guarda el pedido y su detalle en una sola transacción:
     * o se guarda todo, o no se guarda nada.
     *
     * @return id del pedido creado
     */
    public long crear(Pedido pedido, List<ItemCarrito> items) {
        SQLiteDatabase db = helper.getWritableDatabase();
        db.beginTransaction();
        try {
            ContentValues v = new ContentValues();
            v.put(C_FECHA, pedido.getFecha());
            v.put(C_CLIENTE, pedido.getCliente());
            v.put(C_TELEFONO, pedido.getTelefono());
            v.put(C_DIRECCION, pedido.getDireccion());
            v.put(C_CIUDAD, pedido.getCiudad());
            v.put(C_METODO_PAGO, pedido.getMetodoPago());
            v.put(C_SUBTOTAL, pedido.getSubtotal());
            v.put(C_ENVIO, pedido.getEnvio());
            v.put(C_TOTAL, pedido.getTotal());
            v.put(C_ARTICULOS, pedido.getArticulos());
            v.put(C_ESTADO, pedido.getEstado());
            long pedidoId = db.insertOrThrow(T_PEDIDOS, null, v);

            for (ItemCarrito item : items) {
                ContentValues d = new ContentValues();
                d.put(C_PEDIDO_ID, pedidoId);
                d.put(C_PRODUCTO_ID, item.getProductoId());
                d.put(C_NOMBRE, item.getNombre());
                d.put(C_PRECIO, item.getPrecioUnitario());
                d.put(C_CANTIDAD, item.getCantidad());
                db.insertOrThrow(T_DETALLE, null, d);
            }

            db.setTransactionSuccessful();
            return pedidoId;
        } finally {
            db.endTransaction();
        }
    }

    /** Pedidos del más reciente al más antiguo. */
    public List<Pedido> listar() {
        List<Pedido> pedidos = new ArrayList<>();
        SQLiteDatabase db = helper.getReadableDatabase();
        try (Cursor c = db.query(T_PEDIDOS, null, null, null, null, null, C_ID + " DESC")) {
            while (c.moveToNext()) {
                pedidos.add(new Pedido(
                        c.getLong(c.getColumnIndexOrThrow(C_ID)),
                        c.getString(c.getColumnIndexOrThrow(C_FECHA)),
                        c.getString(c.getColumnIndexOrThrow(C_CLIENTE)),
                        c.getString(c.getColumnIndexOrThrow(C_TELEFONO)),
                        c.getString(c.getColumnIndexOrThrow(C_DIRECCION)),
                        c.getString(c.getColumnIndexOrThrow(C_CIUDAD)),
                        c.getString(c.getColumnIndexOrThrow(C_METODO_PAGO)),
                        c.getDouble(c.getColumnIndexOrThrow(C_SUBTOTAL)),
                        c.getDouble(c.getColumnIndexOrThrow(C_ENVIO)),
                        c.getDouble(c.getColumnIndexOrThrow(C_TOTAL)),
                        c.getInt(c.getColumnIndexOrThrow(C_ARTICULOS)),
                        c.getString(c.getColumnIndexOrThrow(C_ESTADO))));
            }
        }
        return pedidos;
    }
}
