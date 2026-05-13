import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../../../shared/apiFetch.ts";

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
    const fetchDescuento = async () => {
      try {
        const descuentoData = await apiFetch(`/descuento/${idDescuento}`);
        setFormData({
          porcentaje: descuentoData.data.porcentaje,
          cantAtencionNecesaria: descuentoData.data.cantAtencionNecesaria,
          estado: descuentoData.data.estado,
        });
      } catch (err: any) {
        setError("No se pudo cargar el descuento: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDescuento();
  }, [idDescuento]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch(`/descuento/${idDescuento}`, {
        method: "PUT",
        body: JSON.stringify({
          porcentaje: Number(formData.porcentaje),
          cantAtencionNecesaria: Number(formData.cantAtencionNecesaria),
          estado: formData.estado
        }),
      });

      setSuccess(data.message);
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
                onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Frecuencia de visitas</label>
              <input type="number" className="form-control" value={formData.cantAtencionNecesaria}
                onChange={(e) => setFormData({ ...formData, cantAtencionNecesaria: e.target.value })} />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="estado" checked={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.checked })} />
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