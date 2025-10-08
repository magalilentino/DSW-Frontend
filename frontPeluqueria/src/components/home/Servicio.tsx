import { useEffect, useState } from "react";
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";

export interface ServicioItem {
  codServicio: number;
  nombreServicio: string;
  cantTurnos: number;
  precio: number;
}

function Servicio() {

  const [showHorarios, setShowHorarios] = useState(false);

  const horarios = [
    "Lunes: 9:00 - 18:00",
    "Martes: 9:00 - 18:00",
    "Miércoles: 9:00 - 18:00",
    "Jueves: 9:00 - 18:00",
    "Viernes: 9:00 - 20:00",
    "Sábado: 9:00 - 14:00",
    "Domingo: Cerrado",
  ];

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

  if (loading) return <p>Cargando servicios...</p>;
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
                key={i}
                className="home-servicio-item d-flex justify-content-between align-items-center mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }} // se repite al entrar/salir
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div>
                  <h5>{s.nombreServicio}</h5>
                  <p className="mb-1">
                    Duración: {Math.floor((s.cantTurnos * 45) / 60)} h{" "}  
                    {(s.cantTurnos * 45) % 60} min
                  </p>
                  <small>{s.precio} ARS</small>
                </div>
                <button className="home-btn-reservar">Reservar</button>
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
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setShowHorarios(!showHorarios)}
              >
                <i className="bi-clock me-1"></i>{" "}
                <span className="text-success">Abierto</span>
                <i className={`ms-2 ${showHorarios ? "bi-caret-up" : "bi-caret-down"}`}></i>
              </p>

              {showHorarios && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {horarios.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </motion.ul>
              )}
            </div>
            <p>
              <i className="bi-geo-alt"></i> Calle 123, Rosario, Santa Fe{" "}
              <a href="#" className="link-underline link-underline-opacity-0">
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