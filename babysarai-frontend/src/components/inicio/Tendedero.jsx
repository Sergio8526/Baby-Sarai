/**
 * El tendedero de la portada: una cuerda con prendas colgadas que se mecen.
 * Si se pasa el mouse rápido por encima, las prendas cercanas se balancean
 * como si hubiera viento (igual que en la tienda babysarai-web).
 */
import { useRef } from 'react';
import Prenda from '../prendas/Prenda.jsx';

/** Prendas colgadas: posición en la cuerda (x, y en %), dibujo y color. */
const PRENDAS_COLGADAS = [
  { x: 12, y: 17.6, tipo: 'body', color: '#F1CFD6' },
  { x: 36, y: 28.1, tipo: 'vestido', color: '#F3D6C0' },
  { x: 64, y: 28.1, tipo: 'enterizo', color: '#C9DCE3' },
  { x: 88, y: 17.6, tipo: 'overol', color: '#DCE8DC' },
];

export default function Tendedero() {
  const prendas = useRef([]); // referencias a cada prenda colgada
  const ultimoX = useRef(null);

  /**
   * Calcula la velocidad del mouse y empuja las prendas que están cerca.
   * Se modifica el DOM directamente (sin estado) porque es una animación
   * que cambia muchas veces por segundo y no debe redibujar el componente.
   */
  const soplar = (evento) => {
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducirMovimiento || evento.pointerType !== 'mouse') return;

    const caja = evento.currentTarget.getBoundingClientRect();
    const velocidad = ultimoX.current === null ? 0 : evento.clientX - ultimoX.current;
    ultimoX.current = evento.clientX;

    prendas.current.forEach((prenda) => {
      if (!prenda) return;
      const r = prenda.getBoundingClientRect();
      const distancia = Math.abs(evento.clientX - (r.left + r.width / 2)) / caja.width;
      const fuerza = Math.max(0, 1 - distancia * 3); // solo las prendas cercanas
      const giro = Math.max(-9, Math.min(9, velocidad * 0.6)) * fuerza;
      if (Math.abs(giro) > 0.4) {
        prenda.style.setProperty('--empuje', `${giro.toFixed(2)}deg`);
        prenda.classList.remove('soplada');
        void prenda.offsetWidth; // reinicia la animación
        prenda.classList.add('soplada');
      }
    });
  };

  return (
    <div
      className="tendedero"
      aria-hidden="true"
      onPointerMove={soplar}
      onPointerLeave={() => {
        ultimoX.current = null;
      }}
    >
      <svg className="tendedero-cuerda" viewBox="0 0 600 300" preserveAspectRatio="none">
        <path d="M-10 30 Q 300 150 610 30" pathLength="1" />
      </svg>

      {PRENDAS_COLGADAS.slice(0, 2).map((p, i) => (
        <Colgada
          key={p.tipo}
          prenda={p}
          indice={i}
          guardarRef={(el) => {
            prendas.current[i] = el;
          }}
        />
      ))}

      <div className="colgada colgada--etiqueta" style={{ '--x': '50%', '--y': '30%', '--i': 2 }}>
        <span className="etiqueta-colgante">0 a 12 meses</span>
      </div>

      {PRENDAS_COLGADAS.slice(2).map((p, i) => (
        <Colgada
          key={p.tipo}
          prenda={p}
          indice={i + 3}
          guardarRef={(el) => {
            prendas.current[i + 2] = el;
          }}
        />
      ))}
    </div>
  );
}

/**
 * Una prenda colgada con sus dos ganchos de madera.
 * @param {{prenda: Object, indice: number, guardarRef: Function}} props
 */
function Colgada({ prenda, indice, guardarRef }) {
  return (
    <div
      ref={guardarRef}
      className="colgada"
      style={{ '--x': `${prenda.x}%`, '--y': `${prenda.y}%`, '--i': indice }}
    >
      <Prenda tipo={prenda.tipo} color={prenda.color} />
      <span className="gancho" />
      <span className="gancho" />
    </div>
  );
}
