/**
 * "¿Qué talla necesita tu bebé?": al mover la barra de edad, la prenda
 * crece y se muestran la talla, el peso y la estatura recomendados.
 */
import { useState } from 'react';
import { Link } from 'react-router';
import Prenda from '../prendas/Prenda.jsx';

/** Tabla de tallas (la misma de la guía de tallas de la tienda). */
const TALLAS = [
  { hasta: 3, talla: '0–3M', peso: '3 a 6 kg', estatura: '50 a 60 cm', escala: 0.78 },
  { hasta: 6, talla: '3–6M', peso: '6 a 8 kg', estatura: '60 a 68 cm', escala: 0.9 },
  { hasta: 12, talla: '6–12M', peso: '8 a 10 kg', estatura: '68 a 76 cm', escala: 1.04 },
];

/**
 * Busca la fila de la tabla según la edad. Al cumplir 3 o 6 meses ya conviene la talla siguiente.
 * @param {number} meses
 */
function tallaParaEdad(meses) {
  return TALLAS.find((t) => meses < t.hasta) ?? TALLAS[TALLAS.length - 1];
}

export default function BuscadorTallas() {
  const [meses, setMeses] = useState(2);
  // Valores derivados: se calculan en cada render a partir del estado, no se guardan aparte
  const fila = tallaParaEdad(meses);
  const textoEdad = meses === 0 ? 'recién nacido' : `${meses} ${meses === 1 ? 'mes' : 'meses'}`;

  return (
    <div className="tallas">
      <div className="tallas-control">
        <h2>¿Qué talla necesita tu bebé?</h2>
        <label className="tallas-etiqueta" htmlFor="edad-bebe">
          Edad del bebé: <output>{textoEdad}</output>
        </label>
        <input
          type="range"
          id="edad-bebe"
          min="0"
          max="12"
          step="1"
          value={meses}
          onChange={(evento) => setMeses(Number(evento.target.value))}
          style={{ '--progreso': `${(meses / 12) * 100}%` }}
        />
        <div className="tallas-escala" aria-hidden="true">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
          <span>12 meses</span>
        </div>
        <p className="tallas-nota">
          Si está entre dos tallas, elige la más grande: el algodón encoge un poco en los primeros
          lavados.
        </p>
        <Link
          to={`/catalogo?q=${encodeURIComponent(fila.talla.replace('–', '-').replace('M', ''))}`}
          className="eyebrow-link"
        >
          Ver prendas en talla {fila.talla}
        </Link>
      </div>

      <div className="tallas-resultado" aria-live="polite">
        <div className="tallas-prenda" style={{ '--escala': fila.escala + meses * 0.008 }}>
          <Prenda tipo="body" color="#C9DCE3" />
        </div>
        {/* La key hace que el párrafo se vuelva a crear al cambiar de talla y repita la animación */}
        <p key={fila.talla} className="tallas-talla cambio">
          {fila.talla}
        </p>
        <dl className="tallas-datos">
          <div>
            <dt>Peso</dt>
            <dd>{fila.peso}</dd>
          </div>
          <div>
            <dt>Estatura</dt>
            <dd>{fila.estatura}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
