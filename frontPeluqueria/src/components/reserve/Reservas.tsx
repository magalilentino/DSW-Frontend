import { useEffect, useState } from "react";
import { motion } from "motion/react"

export interface ServicioItem {
  nombreServicio: string;
  cantTurnos: number;
  precio?: number;
}

interface ReservasProps {
  onSelectServicio: (servicio: ServicioItem) => void;
  servicioSeleccionado: ServicioItem | null;
}

function Reservas({ onSelectServicio, servicioSeleccionado }: ReservasProps) {
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step] = useState(1);

useEffect(() => {
  const fetchServicios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/servicio/findAll");
      if (!res.ok) throw new Error("Error al cargar servicios");
      const data = await res.json();
      setServicios(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchServicios();
}, []);

  if (loading) return <p>Cargando servicios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-lg-8 my-4">
      <div className="reservas-steps mb-4">
        <span className={step === 1 ? "current" : step > 1 ? "active" : ""}>
          Servicios <i className="bi bi-chevron-right"></i>
        </span>
        <span className={step === 2 ? "current" : step > 2 ? "active" : ""}>
          Profesional <i className="bi bi-chevron-right"></i>
        </span>
        <span className={step === 3 ? "current" : step > 3 ? "active" : ""}>
          Hora <i className="bi bi-chevron-right"></i>
        </span>
        <span className={step === 4 ? "current" : ""}>
          Confirmar <i className="bi bi-chevron-right"></i>
        </span>
      </div>

      {step === 1 && (
        <>
          <h2>Servicios</h2>
          <ul className="list-group">
            {servicios.map((s, i) => (
              <motion.li
                key={i}
                className="reservas-servicio-item d-flex justify-content-between align-items-center mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div>
                  <h5>{s.nombreServicio}</h5>
                  <p className="mb-1">
                    Duración: {Math.floor((s.cantTurnos * 40) / 60)} h{" "}
                    {(s.cantTurnos * 40) % 60} min
                  </p>
                  <small>{s.precio} ARS</small>
                </div>
                <button
                  type="button"
                  className={`btn ${
                    s.nombreServicio === servicioSeleccionado?.nombreServicio
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => onSelectServicio(s)}
                >
                  <strong>+</strong>
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Reservas;