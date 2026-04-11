import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

export default function ActualizarMarca() {
  const { idMarca } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/marca/${idMarca}`)
      .then((res) => res.json())
      .then((data) => {
        setNombre(data.data.nombre);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la marca.");
        setLoading(false);
      });
  }, [idMarca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/marca/${idMarca}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar la marca");

      setSuccess("Marca actualizada correctamente");
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
