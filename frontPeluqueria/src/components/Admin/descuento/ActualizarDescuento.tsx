import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ActualizarDescuento() {
  const { idDescuento } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    porcentaje: "",
    cantAtencionNecesaria: "",
    estado: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/descuento/${idDescuento}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          porcentaje: data.data.porcentaje,
          cantAtencionNecesaria: data.data.cantAtencionNecesaria,
          estado: data.data.estado
        });
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el descuento.");
        setLoading(false);
      });
  }, [idDescuento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/descuento/${idDescuento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          porcentaje: Number(formData.porcentaje),
          cantAtencionNecesaria: Number(formData.cantAtencionNecesaria),
          estado: formData.estado
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      setSuccess("Descuento actualizado correctamente");
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
        <h2>Actualizar Descuento</h2>
        {loading ? <p>Cargando...</p> : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Porcentaje (%)</label>
              <input type="number" className="form-control" value={formData.porcentaje} 
                onChange={(e) => setFormData({...formData, porcentaje: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Frecuencia de visitas</label>
              <input type="number" className="form-control" value={formData.cantAtencionNecesaria} 
                onChange={(e) => setFormData({...formData, cantAtencionNecesaria: e.target.value})} />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="estado" checked={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.checked})} />
              <label className="form-check-label" htmlFor="estado">Activo</label>
            </div>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>Actualizar</button>
          </form>
        )}
      </motion.div>
    </div>
  );
}