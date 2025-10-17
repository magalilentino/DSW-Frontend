import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin.css";

export default function CrearTono() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/tono", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error("Error al crear el tono");
      navigate("/tono");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="container my-4">
      <h2>Crear Tono</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre del tono</label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">Crear</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/tono")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
