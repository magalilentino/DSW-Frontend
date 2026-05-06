import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

export default function CrearDescuento() {
  const [formData, setFormData] = useState({
    porcentaje: "",
    cantAtencionNecesaria: "1", // Inicializado en 1 según tu Entity
    estado: true
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/descuento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          porcentaje: Number(formData.porcentaje),
          cantAtencionNecesaria: Number(formData.cantAtencionNecesaria),
          estado: formData.estado
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear el descuento");

      setSuccess("Descuento configurado correctamente");
      setTimeout(() => navigate("/descuento"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="admin-servicio my-4 container-fluid">
      <motion.div className="card p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Nuevo Descuento</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/descuento")}>Volver</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Porcentaje de Descuento (%)</label>
            <input type="number" className="form-control" value={formData.porcentaje} 
              onChange={(e) => setFormData({...formData, porcentaje: e.target.value})} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Cantidad de atenciones necesarias</label>
            <input type="number" className="form-control" value={formData.cantAtencionNecesaria} 
              onChange={(e) => setFormData({...formData, cantAtencionNecesaria: e.target.value})} required />
          </div>

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Crear Descuento"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}