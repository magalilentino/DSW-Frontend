import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

export default function ActualizarMarca() {
  const { idMarca } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMarca = async () => {
      try {
        const data = await apiFetch(`/marca/${idMarca}`);
        setNombre(data.data.nombre);
      } catch (err) {
        setError((err as Error).message || "No se pudo cargar la marca.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarca();
  }, [idMarca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiFetch(`/marca/${idMarca}`, {
        method: "PUT",
        body: JSON.stringify({ nombre }),
      });

      setSuccess(data.message);
      setTimeout(() => navigate("/marca"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h2>Actualizar Marca</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/marca")}
          >
            Volver
          </button>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre de la marca
              </label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-danger">Error: {error}</p>}
            {success && <p className="text-success">{success}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Marca"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
