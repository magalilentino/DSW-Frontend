import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

export default function ActualizarCategoria() {
  const { idCategoria } = useParams();
  const navigate = useNavigate();
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await apiFetch(`/categoria/${idCategoria}`)
        setNombreCategoria(data.data.nombreCategoria);
      } catch (error) {
        setError("No se pudo cargar la categoría.");
      } finally {
        setLoading(false);
      }
    };
      
    fetchCategoria();
  }, [idCategoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiFetch(`/categoria/${idCategoria}`,
        {
          method: "PUT",
          body: JSON.stringify({ nombreCategoria }),
        },
      );

      setSuccess(data.message);
      setTimeout(() => navigate("/categoria"), 1500);
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
          <h2>Actualizar Categoría</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/categoria")}
          >
            Volver
          </button>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombreCategoria" className="form-label">
                Nombre de la categoría
              </label>
              <input
                type="text"
                id="nombreCategoria"
                className="form-control"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
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
              {loading ? "Actualizando..." : "Actualizar Categoría"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
