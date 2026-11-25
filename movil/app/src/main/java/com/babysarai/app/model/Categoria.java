package com.babysarai.app.model;

/**
 * Categoría del catálogo (Recién nacido, Bodies, Pijamas...).
 * Coincide con el JSON de GET /api/categorias.
 */
public class Categoria {

    private int id;
    private String nombre;
    private String descripcion;
    private int activo = 1;

    public Categoria() {
    }

    public Categoria(int id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public boolean estaActiva() { return activo == 1; }

    @Override
    public String toString() { return nombre; }
}
