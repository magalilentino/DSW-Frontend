import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface Atencion {
  idAtencion: number;
  cliente: {
    nombre: string;
  };
}

export default function AtencionPage() {
  const [atenciones, setAtenciones] = useState<Atencion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token"); 

    fetch("http://localhost:3000/api/atencion/pendientes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado"); 
        return res.json();
      })
      .then((data) => {
        setAtenciones(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la lista de atenciones.");
        setLoading(false);
      });
  }, []);

  const handleFinalizar = (idAtencion: number) => {
    navigate(`/atencion/serviciosDeAtencion/${idAtencion}`);
  };

  const handleCancelar = async (idAtencion: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/atencion/cancelar/${idAtencion}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al cancelar la atención.");

      setAtenciones((prev) => prev.filter((a) => a.idAtencion !== idAtencion));
      alert("Atención cancelada exitosamente.");
    } catch (error) {
      console.error(error);
      alert("Error al cancelar la atención.");
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
          <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
            Volver
          </button>
        </div>

        {loading && <p>Cargando atenciones...</p>}
        {error && <p className="text-danger">Error: {error}</p>}

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

