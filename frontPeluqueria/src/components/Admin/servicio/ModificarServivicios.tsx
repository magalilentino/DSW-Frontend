import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Definición de la estructura de los datos del servicio
export interface ServicioData {
  cod_servicio: number;
  nombre_servicio: string;
  descripcion: string;
  cant_turnos: number; // Duración en unidades de turno (45 min)
  precio: number;
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

  // Estado para los datos del formulario, inicializado como null hasta que se carguen
  const [formData, setFormData] = useState<ServicioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. Efecto para cargar los datos del servicio al montar el componente
  useEffect(() => {
    if (!codServicio) {
        setError("ID de servicio no proporcionado.");
        setLoading(false);
        return;
    }

    const fetchServicio = async () => {
      try {
        // Ajusta la ruta si tu API requiere un endpoint diferente para buscar por ID
        const res = await fetch(`http://localhost:3000/api/servicio/findById/${codServicio}`);
        
        if (!res.ok) {
          throw new Error("No se pudo cargar el servicio.");
        }
        
        const data = await res.json();
        
        // Asumiendo que 'data.data' contiene el objeto ServicioData
        if (data.data) {
             setFormData(data.data);
        } else {
             throw new Error("Respuesta de API inválida o servicio no encontrado.");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [codServicio]);


  // 2. Manejador para actualizar el estado del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    
    let newValue: string | number = value;

    // Para 'cant_turnos' y 'precio', nos aseguramos de que sean números
    if (name === "cant_turnos" || name === "precio") {
      // Usamos parseFloat/parseInt para permitir que el campo se vacíe temporalmente
      // y se maneje la entrada de números.
      newValue = parseInt(value) || 0; 
    }
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // 3. Manejador para enviar la actualización
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!formData || formData.nombre_servicio.trim() === "" || formData.precio <= 0) {
        setError("El nombre del servicio y el precio son obligatorios y válidos.");
        setSaving(false);
        return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/servicio/update/${codServicio}`, {
        method: "PUT", // Usamos PUT para la actualización
        headers: {
          "Content-Type": "application/json",
        },
        // Enviamos los datos del formulario, excluyendo el cod_servicio si no debe ir en el body
        body: JSON.stringify(formData), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el servicio.");
      }

      setSuccess(`Servicio "${formData.nombre_servicio}" actualizado con éxito!`);
      
      // Opcional: Redirigir al listado después de un breve momento
      setTimeout(() => {
        navigate("/admin/servicios"); 
      }, 1500);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // 4. Renderizado de estados
  if (loading) {
    return (
        <div className="container my-5 text-center">
            <p>Cargando datos del servicio...</p>
        </div>
    );
  }

  if (error && !formData) { // Solo si hay un error y no se pudo cargar el formulario
    return <div className="alert alert-danger container my-5">Error: {error}</div>;
  }
  
  if (!formData) {
    return <div className="alert alert-warning container my-5">Servicio no encontrado.</div>;
  }

  // 5. Renderizado del formulario de edición
  return (
    <motion.div 
        className="admin-form my-4 container"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Modificar Servicio: {formData.nombre_servicio}</h2>

          {/* Mensajes de estado */}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Campo ID (Solo lectura) */}
            <div className="mb-3">
              <label htmlFor="cod_servicio" className="form-label">
                Código de Servicio (ID)
              </label>
              <input
                type="text"
                className="form-control"
                id="cod_servicio"
                value={formData.cod_servicio}
                readOnly
                disabled
              />
            </div>
            
            {/* Nombre del Servicio */}
            <div className="mb-3">
              <label htmlFor="nombre_servicio" className="form-label">
                Nombre del Servicio
              </label>
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
              <label htmlFor="cant_turnos" className="form-label">
                Duración (en turnos de 45 min)
              </label>
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
                Duración total: **{formatDuration(formData.cant_turnos)}**
              </small>
            </div>

            {/* Precio */}
            <div className="mb-3">
              <label htmlFor="precio" className="form-label">
                Precio (ARS)
              </label>
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