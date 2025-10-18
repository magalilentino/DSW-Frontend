import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

export interface NuevoServicio {
  nombre_servicio: string;
  descripcion: string;
  cant_turnos: number;
  precio: number;
}

const formatDuration = (cantTurnos: number): string => {
  const totalMinutes = cantTurnos * 45;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours} h${minutes > 0 ? ` ${minutes} min` : ""}`;
  }
  return `${minutes} min`;
};

export default function CrearServicio() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NuevoServicio>({
    nombre_servicio: "",
    descripcion: "",
    cant_turnos: 1,
    precio: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "cant_turnos" || name === "precio" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.nombre_servicio.trim() === "" || formData.precio <= 0) {
      setError("El nombre del servicio y el precio son obligatorios y válidos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/servicio/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear el servicio.");

      setSuccess(`Servicio "${formData.nombre_servicio}" creado con éxito!`);
      setTimeout(() => navigate("/servicios"), 1500);
    } catch (err) {
      setError((err as Error).message);
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
          <h2>Crear Servicio</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/servicios")}>
            Volver
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {success && <p className="text-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre_servicio" className="form-label">Nombre del Servicio</label>
            <input
              type="text"
              className="form-control"
              id="nombre_servicio"
              name="nombre_servicio"
              value={formData.nombre_servicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción (Opcional)</label>
            <textarea
              className="form-control"
              id="descripcion"
              name="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cant_turnos" className="form-label">Duración (en turnos de 45 min)</label>
            <input
              type="number"
              className="form-control"
              id="cant_turnos"
              name="cant_turnos"
              min="1"
              value={formData.cant_turnos}
              onChange={handleChange}
              required
            />
            <small className="form-text text-muted">
              Duración total: {formatDuration(formData.cant_turnos)}
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="precio" className="form-label">Precio (ARS)</label>
            <input
              type="number"
              className="form-control"
              id="precio"
              name="precio"
              min="0"
              step="1"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-end mt-4 gap-2">
            <button type="button" className="btn btn-dark" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear Servicio"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
