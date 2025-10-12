import { useEffect, useState } from "react";
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { HORARIOS, DIRECCION, GOOGLE_MAPS_LINK } from "./Constants";

export interface ServicioItem {
  codServicio: number;
  nombreServicio: string;
  cantTurnos: number;
  precio: number;
}

const formatDuration = (cantTurnos: number): string => {
  const totalMinutes = cantTurnos * 45;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} h ${minutes > 0 ? `${minutes} min` : ''}`;
  }
  return `${minutes} min`;
};

function Servicio() {
  const [showHorarios, setShowHorarios] = useState(false);
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch("http://localhost:3000/api/servicio/findAll")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar servicios");
        return res.json();
      })
      .then((data) => setServicios(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
  return (
    <section className="home-servicio my-4">
      <div className="row">
        <div className="col-lg-8">
          <h2>Servicios</h2>
          <ul className="list-group">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="home-servicio-item d-flex justify-content-between align-items-center mb-3 p-3">
                <div style={{ width: '100%' }}>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text-small"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
  if (error) return <p>Error: {error}</p>;
  if (servicios.length === 0) return <p>No hay servicios disponibles.</p>;

  return (
    <section className="home-servicio my-4">
      <div className="row">
        <div className="col-lg-8">
          <h2>Servicios</h2>
          <ul className="list-group">
            {servicios.slice(0, 4).map((s, i) => (
              <motion.li
                key={s.codServicio}
                className="home-servicio-item d-flex justify-content-between align-items-center mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div>
                  <h5>{s.nombreServicio}</h5>
                  <p className="mb-1">
                    Duración: {formatDuration(s.cantTurnos)} 
                  </p>
                  <small>{s.precio} ARS</small>
                </div>
                <button className="home-btn-reservar" onClick={() => navigate("/auth")}>     
                  Reservar
                </button>
              </motion.li>
            ))}
          </ul>
          <button className="home-btn-todo">Ver todo</button>
        </div>

        <div className="col-lg-4">
          <motion.div
            className="border p-3 rounded"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2>Peluqueria</h2>
              <div className="mb-2">
                <span className="me-2">valoración</span>
                <span className="text-warning">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span className="ms-2">(numero de reseñas)</span>
              </div>
              <span className="badge home-badge-outline-success text-success mb-3">
                Ofertas
              </span>
            </div>
            <button
              className="home-btn-reservar-general mb-3"
              onClick={() => navigate("/auth")}
            >
              Reservar ahora
            </button>
            <div>
              <button
                className="btn-reset text-start d-block" // Clase para resetear estilos de botón
                onClick={() => setShowHorarios(!showHorarios)}
                aria-expanded={showHorarios}
                aria-controls="horarios-list"
              >
                <i className="bi-clock me-1"></i>{" "}
                <span className="text-success">Abierto</span>
                <i className={`ms-2 bi ${showHorarios ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
              </button>

              {showHorarios && (
                <motion.ul
                  id="horarios-list"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {HORARIOS.map((h, i) => (
                    <li key={i}>{h.display}</li>
                  ))}
                </motion.ul>
              )}
            </div>
            <p>
              <i className="bi-geo-alt"></i> {DIRECCION}{" "}
              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="link-underline link-underline-opacity-0">
                Cómo llegar
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Servicio;