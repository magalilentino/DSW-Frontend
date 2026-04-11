import { useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

interface DiaItem {
  label: string;
  fecha: string;
}

interface CalendarProps {
  diaSeleccionado: string;
  onSelectDia: (fecha: string) => void;
}

export function CalendarioDias({
  diaSeleccionado,
  onSelectDia,
}: CalendarProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const dias: DiaItem[] = Array.from({ length: 60 }).map((_, i) => {
    const fecha = dayjs().add(i, "day");
    return {
      label: `${fecha.format("ddd").toUpperCase()} ${fecha.format("D")}`,
      fecha: fecha.format("YYYY-MM-DD"),
    };
  });

  const diasVisibles = dias.slice(startIndex, startIndex + 7);
  const mesActual = dayjs(diasVisibles[0].fecha).format("MMMM YYYY");

  const next = () => {
    if (startIndex + 7 < dias.length) {
      setDirection(1);
      setStartIndex(startIndex + 7);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setDirection(-1);
      setStartIndex(Math.max(startIndex - 7, 0));
    }
  };

  return (
    <div className="text-center my-4" style={{ userSelect: "none" }}>
      <h2 className="mb-4 fs-3">{mesActual}</h2>

      <div className="d-flex justify-content-center align-items-center gap-2">
        <div
          className="clickable"
          onClick={prev}
          style={{
            cursor: startIndex === 0 ? "not-allowed" : "pointer",
            opacity: startIndex === 0 ? 0.5 : 1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>

        <div className="flex-grow-1 overflow-hidden gap-2">
          <motion.div
            key={startIndex}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="d-flex flex-grow-1 gap-2"
          >
            {diasVisibles.map((d) => {
              const Lunes = dayjs(d.fecha).day() === 1;

              return (
                <button
                  key={d.fecha}
                  disabled={Lunes}
                  className={`btn ${
                    diaSeleccionado === d.fecha
                      ? "btn-dark text-white"
                      : "btn-light"
                  } flex-grow-1 fs-5`}
                  style={{
                    opacity: Lunes ? 0.4 : 1,
                    cursor: Lunes ? "not-allowed" : "pointer",
                  }}
                  onClick={() => !Lunes && onSelectDia(d.fecha)}
                >
                  {d.label}
                </button>
              );
            })}
          </motion.div>
        </div>

        <div
          className="clickable"
          onClick={next}
          style={{
            cursor: startIndex + 7 >= dias.length ? "not-allowed" : "pointer",
            opacity: startIndex + 7 >= dias.length ? 0.5 : 1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
