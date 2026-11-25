package com.babysarai.app.data.local;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Crea y actualiza la base de datos local SQLite del teléfono.
 *
 * Tablas:
 *  - carrito: productos que el cliente va a comprar.
 *  - pedidos: encabezado de cada pedido registrado.
 *  - pedido_detalle: productos de cada pedido (relación 1 a muchos con pedidos).
 */
public class BabySaraiDbHelper extends SQLiteOpenHelper {

    public static final String NOMBRE_BD = "baby_sarai_movil.db";
    public static final int VERSION_BD = 1;

    // Tabla carrito
    public static final String T_CARRITO = "carrito";
    public static final String C_PRODUCTO_ID = "producto_id";
    public static final String C_NOMBRE = "nombre";
    public static final String C_TALLA = "talla";
    public static final String C_CATEGORIA = "categoria";
    public static final String C_PRECIO = "precio";
    public static final String C_CANTIDAD = "cantidad";
    public static final String C_STOCK = "stock";

    // Tabla pedidos
    public static final String T_PEDIDOS = "pedidos";
    public static final String C_ID = "id";
    public static final String C_FECHA = "fecha";
    public static final String C_CLIENTE = "cliente";
    public static final String C_TELEFONO = "telefono";
    public static final String C_DIRECCION = "direccion";
    public static final String C_CIUDAD = "ciudad";
    public static final String C_METODO_PAGO = "metodo_pago";
    public static final String C_SUBTOTAL = "subtotal";
    public static final String C_ENVIO = "envio";
    public static final String C_TOTAL = "total";
    public static final String C_ARTICULOS = "articulos";
    public static final String C_ESTADO = "estado";

    // Tabla pedido_detalle
    public static final String T_DETALLE = "pedido_detalle";
    public static final String C_PEDIDO_ID = "pedido_id";

    private static volatile BabySaraiDbHelper instancia;

    /** Patrón Singleton: una sola conexión a la base de datos en toda la app. */
    public static BabySaraiDbHelper getInstance(Context context) {
        if (instancia == null) {
            synchronized (BabySaraiDbHelper.class) {
                if (instancia == null) {
                    instancia = new BabySaraiDbHelper(context.getApplicationContext());
                }
            }
        }
        return instancia;
    }

    private BabySaraiDbHelper(Context context) {
        super(context, NOMBRE_BD, null, VERSION_BD);
    }

    @Override
    public void onConfigure(SQLiteDatabase db) {
        super.onConfigure(db);
        db.setForeignKeyConstraintsEnabled(true);   // SQLite no activa las llaves foráneas por defecto
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + T_CARRITO + " ("
                + C_PRODUCTO_ID + " INTEGER PRIMARY KEY, "
                + C_NOMBRE + " TEXT NOT NULL, "
                + C_TALLA + " TEXT, "
                + C_CATEGORIA + " TEXT, "
                + C_PRECIO + " REAL NOT NULL CHECK (" + C_PRECIO + " >= 0), "
                + C_CANTIDAD + " INTEGER NOT NULL CHECK (" + C_CANTIDAD + " > 0), "
                + C_STOCK + " INTEGER NOT NULL)");

        db.execSQL("CREATE TABLE " + T_PEDIDOS + " ("
                + C_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, "
                + C_FECHA + " TEXT NOT NULL, "
                + C_CLIENTE + " TEXT NOT NULL, "
                + C_TELEFONO + " TEXT NOT NULL, "
                + C_DIRECCION + " TEXT NOT NULL, "
                + C_CIUDAD + " TEXT NOT NULL, "
                + C_METODO_PAGO + " TEXT NOT NULL, "
                + C_SUBTOTAL + " REAL NOT NULL, "
                + C_ENVIO + " REAL NOT NULL, "
                + C_TOTAL + " REAL NOT NULL, "
                + C_ARTICULOS + " INTEGER NOT NULL, "
                + C_ESTADO + " TEXT NOT NULL)");

        db.execSQL("CREATE TABLE " + T_DETALLE + " ("
                + C_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, "
                + C_PEDIDO_ID + " INTEGER NOT NULL REFERENCES " + T_PEDIDOS + "(" + C_ID + ") ON DELETE CASCADE, "
                + C_PRODUCTO_ID + " INTEGER NOT NULL, "
                + C_NOMBRE + " TEXT NOT NULL, "
                + C_PRECIO + " REAL NOT NULL, "
                + C_CANTIDAD + " INTEGER NOT NULL)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int versionAnterior, int versionNueva) {
        // Versión 1: no hay migraciones todavía. Si cambia la estructura,
        // aquí se escriben los ALTER TABLE necesarios.
        db.execSQL("DROP TABLE IF EXISTS " + T_DETALLE);
        db.execSQL("DROP TABLE IF EXISTS " + T_PEDIDOS);
        db.execSQL("DROP TABLE IF EXISTS " + T_CARRITO);
        onCreate(db);
    }
}
