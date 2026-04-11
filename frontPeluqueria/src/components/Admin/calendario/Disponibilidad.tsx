import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../general/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface Bloque {
  hora_inicio: string;
  hora_fin: string;
  estado: "libre" | "ocupado";
}

export default function Disponibilidad() {
  const { user } = useAuth();

  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");
  const [bloques, setBloques] = useState<Bloque[]>([]);

  const peluqueroId = user?.idPersona;

  // 🔥 mismos días que GestorDias
  const dias = Array.from({ length: 30 }).map((_, i) => {
    const fecha = dayjs().add(i, "day");
    return {
      label: fecha.format("dddd D [de] MMMM"),
      fecha: fecha.format("YYYY-MM-DD"),
    };
  });

  const fetchDisponibilidad = async () => {
    if (!diaSeleccionado || !peluqueroId) return;

    const res = await fetch(
      `http://localhost:3000/api/bloque/disponibilidad?fecha=${diaSeleccionado}&peluqueroId=${peluqueroId}`,
    );
    const data = await res.json();
    setBloques(data);
  };

  useEffect(() => {
    fetchDisponibilidad();
  }, [diaSeleccionado, peluqueroId]);

  const handleSeleccionarDia = (fecha: string) => {
    setDiaSeleccionado(fecha);
  };

  return (
    <section className="home-servicio my-4 container">
      <div className="row gap-4 gap-lg-0">
        {/* IZQUIERDA (IGUAL) */}
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

        {/* DERECHA (IGUAL ESTRUCTURA) */}
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
                  {bloques.length > 0 ? (
                    bloques.map((bloque, i) => {
                      const esOcupado = bloque.estado === "ocupado";

                      return (
                        <motion.li
                          key={i}
                          className={`d-flex justify-content-between align-items-center mb-2 p-3 border rounded ${
                            esOcupado
                              ? "bg-danger text-white border-danger"
                              : "bg-light"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                        >
                          <div>
                            <h5 className="mb-0 fs-5">
                              {bloque.hora_inicio} - {bloque.hora_fin}
                            </h5>
                          </div>

                          <span
                            className={`fw-bold ${esOcupado ? "text-white" : "text-success"}`}
                          >
                            {esOcupado ? "Ocupado" : "Libre"}
                          </span>
                        </motion.li>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted mt-4">
                      <p>No hay datos para este día.</p>
                    </div>
                  )}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

//ver
