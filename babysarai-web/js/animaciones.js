/* ==========================================================================
   Baby Saraí — Interacciones de la página de inicio
   1. Entrada de la portada (las prendas caen al tendedero).
   2. Viento: las prendas se balancean al pasar el mouse.
   3. Buscador de tallas según la edad del bebé.
   4. Aparición suave de las secciones al hacer scroll.
   ========================================================================== */

const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. Entrada de la portada ---------- */
window.addEventListener('load', () => {
  requestAnimationFrame(() => document.body.classList.add('portada-lista'));
});

/* ---------- 2. Viento en el tendedero ---------- */
function iniciarViento() {
  const tendedero = document.querySelector('[data-tendedero]');
  if (!tendedero || reducirMovimiento || !window.matchMedia('(hover: hover)').matches) return;

  const prendas = [...tendedero.querySelectorAll('.colgada')];
  let ultimoX = null;

  tendedero.addEventListener('pointermove', (evento) => {
    const caja = tendedero.getBoundingClientRect();
    const velocidad = ultimoX === null ? 0 : evento.clientX - ultimoX;
    ultimoX = evento.clientX;

    prendas.forEach((prenda) => {
      const r = prenda.getBoundingClientRect();
      const centro = r.left + r.width / 2;
      const distancia = Math.abs(evento.clientX - centro) / caja.width;
      const fuerza = Math.max(0, 1 - distancia * 3);           // solo las cercanas
      const giro = Math.max(-9, Math.min(9, velocidad * 0.6)) * fuerza;
      if (Math.abs(giro) > 0.4) {
        prenda.style.setProperty('--empuje', `${giro.toFixed(2)}deg`);
        prenda.classList.remove('soplada');
        void prenda.offsetWidth;                                  // reinicia la animación
        prenda.classList.add('soplada');
      }
    });
  });

  tendedero.addEventListener('pointerleave', () => { ultimoX = null; });
}

/* ---------- 3. Buscador de tallas ---------- */
const TALLAS = [
  { hasta: 3, talla: '0–3M', peso: '3 a 6 kg', estatura: '50 a 60 cm', escala: 0.78 },
  { hasta: 6, talla: '3–6M', peso: '6 a 8 kg', estatura: '60 a 68 cm', escala: 0.9 },
  { hasta: 12, talla: '6–12M', peso: '8 a 10 kg', estatura: '68 a 76 cm', escala: 1.04 },
];

function iniciarTallas() {
  const raiz = document.querySelector('[data-tallas]');
  if (!raiz) return;

  const control = raiz.querySelector('[data-edad]');
  const textoEdad = raiz.querySelector('[data-edad-texto]');
  const prenda = raiz.querySelector('[data-tallas-prenda]');
  const campos = {
    talla: raiz.querySelector('[data-talla]'),
    peso: raiz.querySelector('[data-peso]'),
    estatura: raiz.querySelector('[data-estatura]'),
  };

  function actualizar() {
    const meses = Number(control.value);
    // Al cumplir 3 o 6 meses ya conviene la talla siguiente
    const fila = TALLAS.find((t) => meses < t.hasta) || TALLAS[TALLAS.length - 1];

    textoEdad.textContent = meses === 0 ? 'recién nacido' : `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    control.style.setProperty('--progreso', `${(meses / 12) * 100}%`);
    prenda.style.setProperty('--escala', fila.escala + meses * 0.008);

    if (campos.talla.textContent !== fila.talla) {
      campos.talla.classList.remove('cambio');
      void campos.talla.offsetWidth;
      campos.talla.classList.add('cambio');
    }
    campos.talla.textContent = fila.talla;
    campos.peso.textContent = fila.peso;
    campos.estatura.textContent = fila.estatura;
  }

  control.addEventListener('input', actualizar);
  actualizar();
}

/* ---------- 4. Aparición al hacer scroll ---------- */
function iniciarRevelado() {
  const elementos = document.querySelectorAll('[data-revelar]');
  if (reducirMovimiento || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('revelado'));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('revelado');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  // Retraso escalonado entre hermanos (tarjetas de una misma fila)
  elementos.forEach((el) => {
    const hermanos = [...el.parentElement.querySelectorAll(':scope > [data-revelar]')];
    el.style.setProperty('--orden', hermanos.indexOf(el));
    observador.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarViento();
  iniciarTallas();
  iniciarRevelado();
});
