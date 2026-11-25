/**
 * Dibujos de las prendas en SVG (los mismos de la tienda babysarai-web, js/prendas.js).
 * Cada valor es el contenido interno de un <svg viewBox="0 0 120 120">.
 * Las clases p-tela, p-costura, p-boton... tienen sus estilos en styles/tienda.css,
 * y el color de la tela se cambia con la variable CSS --tela.
 */
export const DIBUJOS = {
  body: `
    <path class="p-tela" d="M44 18c4 6 10 9 16 9s12-3 16-9l16 8 10 18-12 6-6-8v36c0 8-6 14-14 18l-2 10H52l-2-10c-8-4-14-10-14-18V42l-6 8-12-6 10-18Z"/>
    <path class="p-costura" d="M27 30 22 40M93 30l5 10M40 92c6 4 34 4 40 0"/>
    <circle class="p-boton" cx="54" cy="101" r="1.8"/><circle class="p-boton" cx="60" cy="101.6" r="1.8"/><circle class="p-boton" cx="66" cy="101" r="1.8"/>`,

  vestido: `
    <path class="p-tela" d="M46 16c4 6 9 8 14 8s10-2 14-8l10 4 4 16-8 4-2 8 18 52c-16 6-56 6-72 0l18-52-2-8-8-4 4-16Z"/>
    <path class="p-costura" d="M42 48c10 3 26 3 36 0M27 96c20 5 46 5 66 0"/>
    <g class="p-flor"><circle cx="50" cy="66" r="3"/><circle cx="68" cy="74" r="3"/><circle cx="56" cy="84" r="3"/><circle cx="74" cy="90" r="2.4"/><circle cx="40" cy="88" r="2.4"/></g>`,

  enterizo: `
    <path class="p-tela" d="M46 12c4 6 9 8 14 8s10-2 14-8l14 6 12 22-10 6-6-8v24l-2 36c0 6-6 10-12 8l-6-2-2-34h-4l-2 34-6 2c-6 2-12-2-12-8l-2-36V38l-6 8-10-6 12-22Z"/>
    <path class="p-costura" d="M60 21v47M38 96h12M70 96h12"/>
    <circle class="p-boton" cx="60" cy="30" r="1.6"/><circle class="p-boton" cx="60" cy="42" r="1.6"/><circle class="p-boton" cx="60" cy="54" r="1.6"/>`,

  conjunto: `
    <path class="p-tela" d="M42 14c4 6 11 8 18 8s14-2 18-8l16 8 8 16-12 6-6-8v22H36V36l-6 8-12-6 8-16Z"/>
    <path class="p-tela p-tela--b" d="M40 62h40l2 46H64l-4-28-4 28H38Z"/>
    <path class="p-costura" d="M40 52h40M44 68h32"/>`,

  chaqueta: `
    <path class="p-tela" d="M44 22c0-10 8-14 16-14s16 4 16 14l16 6 12 38-12 4-6-20v50H34V50l-6 20-12-4 12-38Z"/>
    <path class="p-costura" d="M60 24v76M40 78h12M68 78h12M48 22c4 6 20 6 24 0"/>
    <circle class="p-boton" cx="60" cy="24" r="2.2"/>`,

  overol: `
    <path class="p-tela" d="M40 14h6l4 26h20l4-26h6v42l4 44-18 4-4-28h-4l-4 28-18-4 4-44Z"/>
    <path class="p-costura" d="M50 52h20v12H50ZM42 92h14M64 92h14"/>
    <circle class="p-boton" cx="47" cy="44" r="2.4"/><circle class="p-boton" cx="73" cy="44" r="2.4"/>`,

  gorro: `
    <path class="p-tela" d="M30 80c0-28 14-44 30-44s30 16 30 44Z"/>
    <rect class="p-tela p-tela--b" x="26" y="76" width="68" height="16" rx="7"/>
    <circle class="p-tela p-tela--b" cx="60" cy="30" r="9"/>
    <path class="p-costura" d="M36 80v8M46 80v8M56 80v8M66 80v8M76 80v8M86 80v8"/>`,

  escarpines: `
    <path class="p-tela" d="M18 54v26c0 8 7 12 16 12h14c6 0 8-6 2-10l-12-8V54Z"/>
    <path class="p-tela" d="M64 54v26c0 8 7 12 16 12h14c6 0 8-6 2-10l-12-8V54Z"/>
    <path class="p-costura" d="M18 62h20M64 62h20M24 86h18M70 86h18"/>`,

  cobija: `
    <rect class="p-tela" x="20" y="34" width="80" height="58" rx="8"/>
    <path class="p-tela p-tela--b" d="M20 34h80v14c-14 6-66 6-80 0Z"/>
    <path class="p-costura" d="M28 58h64M28 70h64M28 82h64"/>
    <path class="p-fleco" d="M26 92v8M36 92v8M46 92v8M56 92v8M66 92v8M76 92v8M86 92v8M94 92v8"/>`,

  /* Una sola media (página 404) */
  media: `
    <path class="p-tela" d="M42 14v58c0 16 13 26 30 26h20c11 0 14-11 4-18L70 66V14Z"/>
    <path class="p-tela p-tela--b" d="M42 14h28v14H42Z"/>
    <path class="p-costura" d="M46 21h20M54 90h34"/>`,

  /* Objetos para las páginas de información */
  caja: `
    <path class="p-tela" d="M18 46 60 30l42 16v44L60 106 18 90Z"/>
    <path class="p-tela p-tela--b" d="M18 46 60 62l42-16"/>
    <path class="p-tela p-tela--b" d="M60 62v44"/>
    <path class="p-cinta" d="M38 38.5 80 54.5v14l-6-3-6 5V58L26 42Z"/>
    <path class="p-costura" d="M26 78l24 9M70 87l24-9"/>`,

  cinta: `
    <circle class="p-tela" cx="44" cy="58" r="30"/>
    <circle class="p-tela p-tela--b" cx="44" cy="58" r="12"/>
    <path class="p-tela p-tela--b" d="M44 88h62v14H44Z"/>
    <path class="p-regla" d="M52 88v6M60 88v4M68 88v6M76 88v4M84 88v6M92 88v4M100 88v6"/>
    <path class="p-costura" d="M44 34a24 24 0 0 1 24 24"/>`,

  sobre: `
    <rect class="p-tela" x="16" y="34" width="88" height="60" rx="6"/>
    <path class="p-tela p-tela--b" d="m16 40 44 32 44-32"/>
    <path class="p-costura" d="M24 86l24-20M96 86 72 66"/>
    <path class="p-corazon" d="M60 70s-9-5-9-11c0-3 2-5 5-5 2 0 3 1 4 3 1-2 2-3 4-3 3 0 5 2 5 5 0 6-9 11-9 11Z"/>`,
};
