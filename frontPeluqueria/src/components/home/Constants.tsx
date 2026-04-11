export const HORARIOS = [
  { display: "Lunes: 9:00 - 18:00", day: 1, open: 9, close: 18 },
  { display: "Martes: 9:00 - 18:00", day: 2, open: 9, close: 18 },
  { display: "Miércoles: 9:00 - 18:00", day: 3, open: 9, close: 18 },
  { display: "Jueves: 9:00 - 18:00", day: 4, open: 9, close: 18 },
  { display: "Viernes: 9:00 - 20:00", day: 5, open: 9, close: 20 },
  { display: "Sábado: 9:00 - 14:00", day: 6, open: 9, close: 14 },
  { display: "Domingo: Cerrado", day: 0, open: -1, close: -1 },
];

export const DIRECCION = "San Juan 825, Rosario, Santa Fe";
export const TELEFONO = "+54 341 1234567";
export const EMAIL = "info@peluqueria.com";
export const DESCRIPCION =
  "Ofrecemos cortes, peinados y tratamientos de alta calidad para que siempre luzcas genial.";

export const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DIRECCION)}`;
//constantes
