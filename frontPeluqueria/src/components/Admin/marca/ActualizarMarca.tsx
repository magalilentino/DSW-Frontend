import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

const ActualizarMarca: React.FC = () => {
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

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar la marca");
      }

      setSuccess("Marca actualizada correctamente");
      setTimeout(() => navigate("/marca"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actualizar-container">
         <button
            className="reservas-back-button"
            onClick={() => {window.location.href = "/marca";}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
            </svg>
        </button>
      <h2>Actualizar marca</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <form onSubmit={handleSubmit} className="actualizar-form">
          <label htmlFor="nombre">Nombre de la marca:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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

export default ActualizarMarca;