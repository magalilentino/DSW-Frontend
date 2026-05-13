import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";
import "../../../styles/Registros.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

interface Atencion {
  idAtencion: number;
  cliente: {
    nombre: string;
  };
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export default function AtencionPage() {
  const [atenciones, setAtenciones] = useState<Atencion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const atencionesData = await apiFetch("/atencion/pendientes");
        setAtenciones(atencionesData.data || []);
      } catch (err: any) {
        setError("No se pudo cargar la lista de atenciones: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendientes();
  }, []);


  const handleFinalizar = (idAtencion: number) => {
    navigate(`/atencion/serviciosDeAtencion/${idAtencion}`);
  };

  const handleCancelar = async (idAtencion: number) => {
    try {
      const data = await apiFetch(`/atencion/cancelar/${idAtencion}`,
        {
          method: "PATCH",
        },
      );

      setAtenciones((prev) => prev.filter((a) => a.idAtencion !== idAtencion));
      setSuccess(data.message);
    } catch (error) {
      setError("Error al cancelar la atención.");
    }
  };

  return (
    <div className="admin-servicio my-4 container-fluid">
      <motion.div
        className="card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Atenciones Pendientes</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin")}
          >
            Volver
          </button>
        </div>

        {loading && <p>Cargando atenciones...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {success && <p className="text-success">{success}</p>}

        {!loading && !error && (
          <>
            {atenciones.length === 0 ? (
              <p>No hay atenciones pendientes.</p>
            ) : (
              <ul className="list-unstyled">
                {atenciones.map((a, i) => (
                  <motion.li
                    key={a.idAtencion}
                    className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="service-info me-3">
                      <h5>Atención {a.idAtencion}</h5>
                      <p className="mb-1">Cliente: {a.cliente.nombre}</p>

                      <small className="text-muted">
                        {new Date(a.fecha).toLocaleDateString("es-AR")} |{" "}
                        {new Date(a.horaInicio).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", })} -{" "}
                        {new Date(a.horaFin).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", })}
                      </small>
                    </div>
                    <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
                      <button
                        className="btn btn-sm btn-outline-success admin-btn-action"
                        onClick={() => handleFinalizar(a.idAtencion)}
                      >
                        Finalizar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger admin-btn-action"
                        onClick={() => handleCancelar(a.idAtencion)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
