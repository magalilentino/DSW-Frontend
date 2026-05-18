import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarioDias } from "../../reserve/Calendar.tsx";
import { useAuth } from "../../general/AuthContext.tsx";
import { apiFetch } from "../../../shared/apiFetch.ts";

interface BloqueAgenda {
  hora_inicio: string;
  hora_fin: string;
  estado: "libre" | "ocupado" | "bloqueado";
}

export default function BloquearAgenda() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");
  const [bloques, setBloques] = useState<BloqueAgenda[]>([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState<string[]>([]);
  const [conflictos, setConflictos] = useState<string[]>([]);

  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "success" | "error" | "warning";
  } | null>(null);

  const fetchAgenda = async () => {
    if (!diaSeleccionado || !user?.idPersona) return;

    try {
      const data = await apiFetch(
        `/bloque/estado-agenda?fecha=${diaSeleccionado}&peluqueroId=${user.idPersona}`,
      );

      setBloques(data);
    } catch {
      setMensaje({
        texto: "Error al procesar agenda",
        tipo: "error",
      });
    }
  };

  useEffect(() => {
    fetchAgenda();
    setHorariosSeleccionados([]);
    setConflictos([]);
    setMensaje(null);
  }, [diaSeleccionado]);

  const toggleHorario = (horaInicio: string) => {
    setHorariosSeleccionados((prev) =>
      prev.includes(horaInicio)
        ? prev.filter((h) => h !== horaInicio)
        : [...prev, horaInicio],
    );
  };

  const handleGuardarBloqueo = async (forzar = false) => {
    if (!diaSeleccionado || !user?.idPersona) return;

    try {
      const data = await apiFetch("/bloque/bloqueodia", {
        method: "POST",
        body: JSON.stringify({
          peluqueroId: user.idPersona,
          fecha: diaSeleccionado,
          horarios: horariosSeleccionados,
          forzar,
        }),
      });

      if (data.conflictos && data.conflictos.length > 0) {
        setConflictos(data.conflictos);

        setMensaje({
          texto: "Hay clientes citados en esos horarios.",
          tipo: "warning",
        });
      } else {
        setMensaje({
          texto: "Agenda actualizada correctamente.",
          tipo: "success",
        });

        setConflictos([]);
        setHorariosSeleccionados([]);

        fetchAgenda();
      }
    } catch {
      setMensaje({
        texto: "Error al guardar.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="container mt-5">
      <button
        className="admin-back-button mb-3"
        onClick={() => navigate("/admin")}
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
      </button>

      <section className="mb-4 bg-white p-3 rounded shadow-sm border">
        <CalendarioDias
          diaSeleccionado={diaSeleccionado}
          onSelectDia={setDiaSeleccionado}
        />
      </section>

      {diaSeleccionado && (
        <div className="row">
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded shadow-sm border">
              <h4 className="mb-4 fw-bold">Horarios del Día</h4>

              <div className="d-flex flex-wrap gap-2">
                {bloques.map((b, i) => {
                  const isSel = horariosSeleccionados.includes(b.hora_inicio);

                  const isLibre = b.estado === "libre";
                  const isBloqueado = b.estado === "bloqueado";
                  const isOcupado = b.estado === "ocupado";

                  const isClickable = isLibre || isBloqueado;

                  return (
                    <motion.button
                      key={i}
                      whileHover={isClickable ? { scale: 1.05 } : {}}
                      className={`btn ${
                        isOcupado
                          ? "btn-danger opacity-50"
                          : isBloqueado
                            ? isSel
                              ? "btn-outline-dark"
                              : "btn-secondary"
                            : isSel
                              ? "btn-dark"
                              : "btn-outline-dark"
                      }`}
                      onClick={() =>
                        isClickable && toggleHorario(b.hora_inicio)
                      }
                      disabled={isOcupado}
                    >
                      <span className="d-block fw-bold">
                        {b.hora_inicio}
                      </span>

                      <small style={{ fontSize: "0.7rem" }}>
                        {isSel
                          ? isBloqueado
                            ? "A LIBERAR"
                            : "A BLOQUEAR"
                          : b.estado.toUpperCase()}
                      </small>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="bg-white p-4 rounded shadow-sm border sticky-top"
              style={{ top: "20px" }}
            >
              <h4 className="fw-bold mb-4">Confirmar</h4>

              <div className="mb-3">
                <label className="small fw-bold text-muted text-uppercase">
                  Fecha
                </label>

                <div className="fw-bold fs-5">
                  {diaSeleccionado}
                </div>
              </div>

              <div className="mb-4">
                <label className="small fw-bold text-muted text-uppercase d-block mb-2">
                  Bloques seleccionados
                </label>

                <div className="d-flex flex-wrap gap-1">
                  {horariosSeleccionados.length > 0 ? (
                    horariosSeleccionados.map((h) => (
                      <span
                        key={h}
                        className="badge bg-dark rounded-pill px-3 py-2"
                      >
                        {h}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small italic">
                      Ninguno
                    </span>
                  )}
                </div>
              </div>

              {mensaje && (
                <div
                  className={`alert alert-${
                    mensaje.tipo === "warning"
                      ? "warning"
                      : mensaje.tipo === "error"
                        ? "danger"
                        : "success"
                  } small py-2`}
                >
                  {mensaje.texto}

                  {conflictos.length > 0 && (
                    <div className="mt-1">
                      <strong>Citas:</strong>{" "}
                      {conflictos.join(", ")}
                    </div>
                  )}
                </div>
              )}

              {conflictos.length > 0 ? (
                <button
                  className="btn btn-warning w-100 fw-bold py-3 mt-2"
                  style={{ borderRadius: "12px" }}
                  onClick={() => handleGuardarBloqueo(true)}
                >
                  FORZAR Y BLOQUEAR
                </button>
              ) : (
                <button
                  className="btn btn-dark w-100 fw-bold py-3 mt-2"
                  style={{ borderRadius: "12px" }}
                  disabled={horariosSeleccionados.length === 0}
                  onClick={() => handleGuardarBloqueo(false)}
                >
                  CONFIRMAR
                </button>
              )}

              {horariosSeleccionados.length > 0 && (
                <button
                  className="btn btn-link btn-sm w-100 mt-2 text-muted text-decoration-none"
                  onClick={() => setHorariosSeleccionados([])}
                >
                  Limpiar selección
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}