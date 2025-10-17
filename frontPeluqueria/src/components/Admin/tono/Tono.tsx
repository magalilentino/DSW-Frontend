import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface Tono {
  idTono: number;
  nombre: string;
}

export default function TonoPage() {
  const [tonos, setTonos] = useState<Tono[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTonos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tono");
      if (!res.ok) throw new Error("Error al cargar tonos");
      const data = await res.json();
      setTonos(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idTono: number) => {
    if (window.confirm(`¿Seguro que querés borrar el tono ${idTono}?`)) {
      try {
        const res = await fetch(`http://localhost:3000/api/tono/${idTono}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al borrar el tono");
        setTonos((prev) => prev.filter((t) => t.idTono !== idTono));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchTonos();
  }, []);

  if (loading) return <p>Cargando tonos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-servicio my-4 container-fluid">
      <div className="row">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Tonos</h2>
            <button className="btn btn-primary" onClick={() => navigate("/tono/crear")}>
              Agregar Tono
            </button>
          </div>

          {tonos.length === 0 ? (
            <p>No hay tonos disponibles.</p>
          ) : (
            <ul className="list-unstyled">
              {tonos.map((t, i) => (
                <motion.li
                  key={t.idTono}
                  className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="service-info me-3">
                    <h5>Tono #{t.idTono}</h5>
                    <p className="mb-1">Nombre: {t.nombre}</p>
                  </div>
                  <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-outline-secondary admin-btn-action"
                      onClick={() => navigate(`/tono/actualizar/${t.idTono}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark admin-btn-action"
                      onClick={() => handleDelete(t.idTono)}
                    >
                      Borrar
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
