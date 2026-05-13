import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../../../shared/apiFetch.ts";

export interface ServicioData {
  codServicio: number;
  nombreServicio: string;
  descripcion: string;
  cantTurnos: number; // Duración en unidades de turno (45 min)
  precio: number;
  activo: boolean;
  requiereTono: boolean;
}

// Función auxiliar para formatear la duración
const formatDuration = (cantTurnos: number): string => {
  const totalMinutes = cantTurnos * 45;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours} h${minutes > 0 ? ` ${minutes} min` : ""}`;
  }
  return `${minutes} min`;
};

function ModificarServicio() {
  const { codServicio } = useParams<{ codServicio: string }>(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ServicioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!codServicio) {
      setError("ID de servicio no proporcionado.");
      setLoading(false);
      return;
    }

    const fetchServicio = async () => {
      try {
        const data = await apiFetch(`/servicio/findById/${codServicio}`);

        // 'data.data' contiene el objeto ServicioData
        if (data.data) {
          setFormData(data.data);
        } else {
          throw new Error(
            "Respuesta de API inválida o servicio no encontrado.",
          );
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [codServicio]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!formData) return;

    const { name, value } = e.target;

    let newValue: string | number = value;

    if (name === "cantTurnos" || name === "precio") {
      const parsed = parseFloat(value);
      newValue = isNaN(parsed) ? 0 : parsed;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (
      !formData ||
      formData.nombreServicio.trim() === "" ||
      formData.precio <= 0
    ) {
      setError(
        "El nombre del servicio y el precio son obligatorios y válidos.",
      );
      setSaving(false);
      return;
    }

    try {
      const data = await apiFetch(`/servicio/${codServicio}`,
        {
          method: "PUT", 
          body: JSON.stringify(formData),
        },
      );

      setSuccess(data.message);

      setTimeout(() => {
        navigate("/servicios");
      }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <p>Cargando datos del servicio...</p>
      </div>
    );
  }

  if (error && !formData) {
    // Solo si hay un error y no se pudo cargar el formulario
    return (
      <div className="alert alert-danger container my-5">Error: {error}</div>
    );
  }

  if (!formData) {
    return (
      <div className="alert alert-warning container my-5">
        Servicio no encontrado.
      </div>
    );
  }

  return (
    <motion.div
      className="admin-form my-4 container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Modificar Servicio {codServicio}:</h2>

          {/* Mensajes de estado */}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Campo ID (Solo lectura) */}
            {/* <div className="mb-3">
              <label htmlFor=S" className="form-label">
                Código de Servicio (ID)
              </label>
              <input
                type="text"
                className="form-control"
                id=S"
                value={formDataS}
                readOnly
                disabled
              />
            </div> */}

            {/* Nombre del Servicio */}
            <div className="mb-3">
              <label htmlFor="nombreServicio" className="form-label">
                Nombre del Servicio
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreServicio"
                name="nombreServicio"
                value={formData.nombreServicio}
                onChange={handleChange}
                required
              />
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción (Opcional)
              </label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                rows={3}
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>

            {/* Cantidad de Turnos / Duración */}
            <div className="mb-3">
              <label htmlFor="cantTurnos" className="form-label">
                Duración (en turnos de 45 min)
              </label>
              <input
                type="number"
                className="form-control"
                id="cantTurnos"
                name="cantTurnos"
                min="1"
                value={formData.cantTurnos}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                Duración total: **{formatDuration(formData.cantTurnos)}**
              </small>
            </div>

            {/* Precio */}
            <div className="mb-3">
              <label htmlFor="precio" className="form-label">
                Precio (ARS)
              </label>
              <input
                type="text"
                inputMode="decimal"
                className="form-control"
                id="precio"
                name="precio"
                value={formData.precio.toString()}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", "."); // convierte coma a punto - no anda
                  const cleaned = raw.replace(/^0+(?!\.)/, ""); // elimina ceros a la izquierda salvo decimales
                  const num = parseFloat(cleaned);
                  setFormData({ ...formData, precio: isNaN(num) ? 0 : num });
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="activo" className="form-label">
                Estado
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => {
                    setFormData({ ...formData, activo: e.target.checked });
                  }}
                />
                <label className="form-check-label" htmlFor="activo">
                  Activo
                </label>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="activo" className="form-label">
                Tono
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="requiereTono"
                  checked={formData.requiereTono}
                  onChange={(e) => {
                    setFormData({ ...formData, requiereTono: e.target.checked });
                  }}
                />
                <label className="form-check-label" htmlFor="requiereTono">
                  Requiere Tono
                </label>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)} // Volver a la vista anterior
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default ModificarServicio;
