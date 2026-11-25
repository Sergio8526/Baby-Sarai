/**
 * Hook para consultar datos de la API desde un componente.
 * Maneja los tres estados de cualquier consulta: cargando, datos y error.
 */
import { useCallback, useEffect, useState } from 'react';

/**
 * @param {() => Promise<any>} funcionConsulta - Función del servicio que trae los datos.
 *   Debe ser estable (definida fuera del componente o con useCallback);
 *   si cambia, la consulta se vuelve a ejecutar.
 * @returns {{datos: any, cargando: boolean, error: Error|null, recargar: () => void}}
 */
export function useConsulta(funcionConsulta) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  // Cada vez que cambia "version" se repite la consulta (lo usa recargar)
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Evita actualizar el estado si el componente ya no está en pantalla
    // o si llegó una consulta más nueva antes de que terminara esta.
    let vigente = true;

    funcionConsulta()
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: null });
      })
      .catch((error) => {
        if (vigente) setEstado({ datos: null, cargando: false, error });
      });

    return () => {
      vigente = false;
    };
  }, [funcionConsulta, version]);

  /** Vuelve a pedir los datos, por ejemplo después de guardar o eliminar. */
  const recargar = useCallback(() => {
    setEstado((anterior) => ({ ...anterior, cargando: true }));
    setVersion((v) => v + 1);
  }, []);

  return { ...estado, recargar };
}
