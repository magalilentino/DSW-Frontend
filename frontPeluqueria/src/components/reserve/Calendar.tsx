import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

interface DiaItem {
  label: string;
  fecha: string;
}

export function CalendarioDias() {
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");
  const [startIndex, setStartIndex] = useState(0);

  // Generamos 60 días desde hoy
  const dias: DiaItem[] = Array.from({ length: 60 }).map((_, i) => {
    const fecha = dayjs().add(i, "day");
    return {
      label: `${fecha.format("ddd").toUpperCase()} ${fecha.format("D")}`,
      fecha: fecha.format("YYYY-MM-DD"),
    };
  });

  const diasVisibles = dias.slice(startIndex, startIndex + 7);

  const next = () => {
    if (startIndex + 7 < dias.length) setStartIndex(startIndex + 1);
  };

  const prev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  // Mostrar el mes del primer día visible
  const mesActual = dayjs(diasVisibles[0].fecha).format("MMMM YYYY");

  return (
    <div className="flex flex-col items-center mt-4 w-full">
      {/* Mes arriba */}
      <h2 className="text-lg font-semibold mb-2">{mesActual}</h2>

      {/* Fila única con flechas y días */}
      <div className="flex items-center w-full max-w-3xl gap-2">
        {/* Flecha izquierda */}
        <button
          onClick={prev}
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={startIndex === 0}
        >
          ◀
        </button>

        {/* Dias centrales */}
        <div className="flex justify-center gap-3 flex-1">
          {diasVisibles.map((d) => (
            <button
              key={d.fecha}
              onClick={() => setDiaSeleccionado(d.fecha)}
              className={`px-4 py-2 rounded-2xl border text-center transition-all whitespace-nowrap ${
                diaSeleccionado === d.fecha
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <p className="text-sm font-semibold">{d.label}</p>
            </button>
          ))}
        </div>

        {/* Flecha derecha */}
        <button
          onClick={next}
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={startIndex + 7 >= dias.length}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
