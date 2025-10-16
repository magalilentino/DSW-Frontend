import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin.css";

export default function EditarTono() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { idTono } = useParams();

  const fetchTono = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tono/${idTono}`);
      if (!res.ok) throw new Error("Error al cargar el tono");
      const data = await res.json();
      setNombre(data.data.nombre || "");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/tono/${idTono}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error("Error al actualizar el tono");
      navigate("/tono");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchTono();
  }, [idTono]);

  return (
    <div className="container my-4">
      <h2>Editar Tono</h2>
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
          <button type="submit" className="btn btn-success">Actualizar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/tono")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
