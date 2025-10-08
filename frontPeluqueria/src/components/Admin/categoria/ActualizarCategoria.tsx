import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/ActualizarCategoria.css";

const ActualizarCategoria: React.FC = () => {
  const { idCategoria } = useParams();
  const navigate = useNavigate();
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/categoria/${idCategoria}`)
      .then((res) => res.json())
      .then((data) => {
        setNombreCategoria(data.data.nombreCategoria);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la categoría.");
        setLoading(false);
      });
  }, [idCategoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/categoria/${idCategoria}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreCategoria }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar la categoría");
      }

      setSuccess("Categoría actualizada correctamente");
      setTimeout(() => navigate("/categoria"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actualizar-categoria-container">
      <h2>Actualizar categoría</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <form onSubmit={handleSubmit} className="actualizar-categoria-form">
          <label htmlFor="nombreCategoria">Nombre de la categoría:</label>
          <input
            type="text"
            id="nombreCategoria"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ActualizarCategoria;