import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/CrearCategoria.css";

const CrearCategoria: React.FC = () => {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/categoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreCategoria }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear la categoría");
      }

      setSuccess("Categoría creada correctamente");
      setTimeout(() => navigate("/categoria"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-categoria-container">
      <h2>Crear nueva categoría</h2>
      <form onSubmit={handleSubmit} className="crear-categoria-form">
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
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default CrearCategoria;