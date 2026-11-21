/**
 * Hook para la aparición suave al hacer scroll (igual que en la tienda).
 * El elemento empieza transparente (regla [data-revelar] de tienda.css) y,
 * cuando entra en pantalla, recibe la clase "revelado".
 *
 * Uso: const ref = useRevelar();  <article ref={ref} data-revelar>...</article>
 */
import { useEffect, useRef } from 'react';

export function useRevelar() {
  const ref = useRef(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return undefined;

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducirMovimiento || !('IntersectionObserver' in window)) {
      elemento.classList.add('revelado');
      return undefined;
    }

    // IntersectionObserver avisa cuando el elemento entra en la zona visible
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.classList.add('revelado');
          observador.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observador.observe(elemento);

    return () => observador.disconnect();
  }, []);

  return ref;
}
