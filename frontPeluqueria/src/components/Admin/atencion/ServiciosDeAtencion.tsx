import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface AtSer {
  idAtSer: number;
  nombreServicio: string;
  modificado: boolean;
}

export default function ServiciosDeAtencion() {
  const { idAtencion } = useParams();
  const navigate = useNavigate();
  const [atSers, setAtSer] = useState<AtSer[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (!idAtencion) {
      setError("Error: ID de Atención no encontrado.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/atSer/${idAtencion}/serviciosPorAtencion`)
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `Error ${res.status}: No autorizado o recurso no encontrado.`,
          );
        return res.json();
      })
      .then((data) => {
        setAtSer(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar servicios:", err);
        setError("No se pudo cargar la lista de servicios.");
        setLoading(false);
      });
  }, [idAtencion, location]);

  const handleModificar = (idAtSer: number) => {
    navigate(`/atencion/modificarAtSer/${idAtSer}`);
  };

  const handleFinalizarAtencion = async () => {
    if (!idAtencion) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/atencion/finalizar/${idAtencion}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descripcion }),
        },
      );

      if (!response.ok) throw new Error("Error al finalizar la atención.");

      alert("Atención y servicios registrados como finalizados exitosamente.");
      navigate("/atencion");
    } catch (error) {
      console.error("Error al finalizar atención:", error);
      alert("Error al registrar la atención como finalizada.");
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
          <h2>Servicios de la Atención</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/atencion")}
          >
            Volver
          </button>
        </div>

        {loading && <p>Cargando servicios...</p>}
        {error && <p className="text-danger">Error: {error}</p>}

        {!loading && !error && (
          <>
            {atSers.length === 0 ? (
              <p>No hay servicios registrados para esta atención.</p>
            ) : (
              <ul className="list-unstyled">
                {atSers.map((as, i) => (
                  <motion.li
                    key={as.idAtSer}
                    className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="service-info me-3">
                      <h5>Servicio </h5>
                      <p className="mb-1">
                        {as.nombreServicio}
                      </p>
                    </div>
                    <div className="service-actions">
                      <button
                        className="btn btn-sm btn-outline-primary admin-btn-action"
                        onClick={() => handleModificar(as.idAtSer)}
                      >
                        {as.modificado ? "Volver a modificar" : "Modificar"}
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <label htmlFor="descripcion" className="form-label">
                Especificaciones adicionales
              </label>
              <textarea
                id="descripcion"
                className="form-control"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-success"
                onClick={handleFinalizarAtencion}
              >
                Registrar Atención como Finalizada
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
