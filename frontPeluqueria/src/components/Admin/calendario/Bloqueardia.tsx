import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../general/AuthContext.tsx";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface Bloque {
  hora_inicio: string;
  hora_fin: string;
}

export default function GestorDias() {
  const { user } = useAuth();
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<Bloque | null>(
    null,
  );
  const [bloquesDisponibles, setBloquesDisponibles] = useState<Bloque[]>([]);

  const peluqueroId = user?.idPersona;
  const duracionTotal = 45;

  // 🔥 Generador de días
  const dias = Array.from({ length: 30 }).map((_, i) => {
    const fecha = dayjs().add(i, "day");
    return {
      label: fecha.format("dddd D [de] MMMM"),
      fecha: fecha.format("YYYY-MM-DD"),
    };
  });

  // 🔥 Fetch de bloques
  const fetchBloques = async () => {
    if (!diaSeleccionado || !peluqueroId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/bloque/disponibles?fecha=${diaSeleccionado}&peluqueroId=${peluqueroId}&duracionTotal=${duracionTotal}`,
      );
      const data = await res.json();
      setBloquesDisponibles(data);
    } catch (err) {
      console.error("Error al traer horarios:", err);
    }
  };

  useEffect(() => {
    if (!diaSeleccionado || !peluqueroId) return;
    fetchBloques();
  }, [diaSeleccionado, peluqueroId]);

  // 🔥 BLOQUEAR HORA
  const bloquearBloque = async (bloque: Bloque) => {
    try {
      // ⚡ feedback instantáneo
      setBloquesDisponibles((prev) =>
        prev.filter((b) => b.hora_inicio !== bloque.hora_inicio),
      );

      await fetch("http://localhost:3000/api/bloque/bloquear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha: diaSeleccionado,
          peluqueroId,
          hora_inicio: bloque.hora_inicio,
          hora_fin: bloque.hora_fin,
        }),
      });

      // 🔄 refresco real
      fetchBloques();
    } catch (err) {
      console.error("Error al bloquear:", err);
    }
  };

  const handleSeleccionarDia = (fecha: string) => {
    setDiaSeleccionado(fecha);
    setHorarioSeleccionado(null);
  };

  const bloquearDiaCompleto = async () => {
    if (!peluqueroId || !diaSeleccionado) return;

    try {
      await fetch("http://localhost:3000/api/bloque/bloquear-dia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha: diaSeleccionado,
          peluqueroId,
        }),
      });

      // 🔄 refrescar
      fetchBloques();
    } catch (err) {
      console.error("Error al bloquear el día:", err);
    }
  };

  return (
    <section className="home-servicio my-4 container">
      <div className="row gap-4 gap-lg-0">
        {/* IZQUIERDA */}
        <div className="col-lg-5">
          <h2 className="mb-4">Fechas</h2>
          <div className="overflow-auto" style={{ maxHeight: "600px" }}>
            <ul className="list-group pe-2">
              {dias.map((d, i) => (
                <motion.li
                  key={d.fecha}
                  className={`home-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded ${
                    diaSeleccionado === d.fecha
                      ? "border-dark shadow-sm bg-light"
                      : ""
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSeleccionarDia(d.fecha)}
                >
                  <h5 className="text-capitalize mb-0 fs-6">{d.label}</h5>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        {/* DERECHA */}
        <div className="col-lg-7">
          <h2 className="mb-4">Disponibilidad</h2>
          <div className="p-4 border rounded bg-white shadow-sm h-100 d-flex flex-column">
            {!diaSeleccionado ? (
              <div className="text-center text-muted m-auto">
                <p>Selecciona un día para ver horarios.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="d-flex flex-column flex-grow-1"
              >
                <h4 className="border-bottom pb-2 mb-4">
                  Gestión del{" "}
                  <span className="text-primary fw-bold">
                    {dayjs(diaSeleccionado).format("DD/MM/YYYY")}
                  </span>
                </h4>
                <h5 className="fs-6 text-secondary mb-3">Horarios:</h5>
                <ul
                  className="list-group mb-4 overflow-auto pe-2"
                  style={{ maxHeight: "350px" }}
                >
                  {bloquesDisponibles.length > 0 ? (
                    bloquesDisponibles.map((bloque, i) => {
                      const esSeleccionado =
                        horarioSeleccionado?.hora_inicio ===
                          bloque.hora_inicio &&
                        horarioSeleccionado?.hora_fin === bloque.hora_fin;

                      return (
                        <motion.li
                          key={i}
                          className={`d-flex justify-content-between align-items-center mb-2 p-3 border rounded ${
                            esSeleccionado ? "border-dark shadow" : "bg-light"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          style={{ cursor: "pointer" }}
                          onClick={() => setHorarioSeleccionado(bloque)}
                        >
                          <h5 className="mb-0 fs-5">
                            {bloque.hora_inicio} - {bloque.hora_fin}
                          </h5>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              bloquearBloque(bloque);
                            }}
                          >
                            Bloquear hora
                          </button>
                        </motion.li>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted mt-4">
                      <p>No hay bloques disponibles.</p>
                    </div>
                  )}
                </ul>
                {/* Acciones de administración general */}
                <div className="mt-auto pt-3 border-top">
                  <h5 className="fs-6 text-danger mb-3">
                    Acciones de administrador:
                  </h5>
                  <button
                    className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={bloquearDiaCompleto}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />{" "}
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />{" "}
                    </svg>
                    Bloquear todo el día seleccionado
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
