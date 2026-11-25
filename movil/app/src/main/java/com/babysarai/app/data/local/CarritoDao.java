package com.babysarai.app.data.local;

import static com.babysarai.app.data.local.BabySaraiDbHelper.C_CANTIDAD;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_CATEGORIA;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_NOMBRE;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_PRECIO;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_PRODUCTO_ID;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_STOCK;
import static com.babysarai.app.data.local.BabySaraiDbHelper.C_TALLA;
import static com.babysarai.app.data.local.BabySaraiDbHelper.T_CARRITO;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.babysarai.app.model.ItemCarrito;

import java.util.ArrayList;
import java.util.List;

/**
 * Objeto de acceso a datos (DAO) de la tabla carrito.
 * Todas las consultas usan parámetros (?) para evitar inyección SQL.
 */
public class CarritoDao {

    private final BabySaraiDbHelper helper;

    public CarritoDao(BabySaraiDbHelper helper) {
        this.helper = helper;
    }

    public List<ItemCarrito> listar() {
        List<ItemCarrito> items = new ArrayList<>();
        SQLiteDatabase db = helper.getReadableDatabase();
        try (Cursor c = db.query(T_CARRITO, null, null, null, null, null, C_NOMBRE + " ASC")) {
            while (c.moveToNext()) {
                items.add(leer(c));
            }
        }
        return items;
    }

    /** @return la línea del producto o null si no está en el carrito. */
    public ItemCarrito buscar(int productoId) {
        SQLiteDatabase db = helper.getReadableDatabase();
        try (Cursor c = db.query(T_CARRITO, null, C_PRODUCTO_ID + " = ?",
                new String[]{String.valueOf(productoId)}, null, null, null)) {
            return c.moveToFirst() ? leer(c) : null;
        }
    }

    /** Inserta la línea o la reemplaza si el producto ya estaba. */
    public void guardar(ItemCarrito item) {
        ContentValues v = new ContentValues();
        v.put(C_PRODUCTO_ID, item.getProductoId());
        v.put(C_NOMBRE, item.getNombre());
        v.put(C_TALLA, item.getTalla());
        v.put(C_CATEGORIA, item.getCategoriaNombre());
        v.put(C_PRECIO, item.getPrecioUnitario());
        v.put(C_CANTIDAD, item.getCantidad());
        v.put(C_STOCK, item.getStockDisponible());
        helper.getWritableDatabase().insertWithOnConflict(T_CARRITO, null, v, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public int eliminar(int productoId) {
        return helper.getWritableDatabase().delete(T_CARRITO, C_PRODUCTO_ID + " = ?",
                new String[]{String.valueOf(productoId)});
    }

    public void vaciar() {
        helper.getWritableDatabase().delete(T_CARRITO, null, null);
    }

    private ItemCarrito leer(Cursor c) {
        return new ItemCarrito(
                c.getInt(c.getColumnIndexOrThrow(C_PRODUCTO_ID)),
                c.getString(c.getColumnIndexOrThrow(C_NOMBRE)),
                c.getString(c.getColumnIndexOrThrow(C_TALLA)),
                c.getString(c.getColumnIndexOrThrow(C_CATEGORIA)),
                c.getDouble(c.getColumnIndexOrThrow(C_PRECIO)),
                c.getInt(c.getColumnIndexOrThrow(C_CANTIDAD)),
                c.getInt(c.getColumnIndexOrThrow(C_STOCK)));
    }
}
