import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface Marca {
  idMarca: number;
  nombre: string;
}

export default function MarcaPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMarcas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/marca");
      if (!res.ok) throw new Error("Error al cargar marcas");
      const data = await res.json();
      setMarcas(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idMarca: number) => {
    if (window.confirm(`¿Estás seguro que quieres borrar la marca ${idMarca}?`)) {
      try {
        const res = await fetch(`http://localhost:3000/api/marca/${idMarca}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al borrar la marca");
        setMarcas((prev) => prev.filter((m) => m.idMarca !== idMarca));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  if (loading) return <p>Cargando marcas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-servicio my-4 container-fluid">
      <div className="row">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Marcas</h2>
            <button className="btn btn-primary" onClick={() => navigate("/marca/crear")}>
              Agregar Marca
            </button>
          </div>

          {marcas.length === 0 ? (
            <p>No hay marcas disponibles.</p>
          ) : (
            <ul className="list-unstyled">
              {marcas.map((m, i) => (
                <motion.li
                  key={m.idMarca}
                  className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="service-info me-3">
                    <h5>Marca #{m.idMarca}</h5>
                    <p className="mb-1">Nombre: {m.nombre}</p>
                  </div>
                  <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-outline-secondary admin-btn-action"
                      onClick={() => navigate(`/marca/actualizar/${m.idMarca}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark admin-btn-action"
                      onClick={() => handleDelete(m.idMarca)}
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
