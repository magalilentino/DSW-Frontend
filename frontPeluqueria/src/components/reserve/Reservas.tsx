import { useEffect, useState } from "react";
import { motion } from "motion/react"
import type { PeluqueroItem } from "../home/Peluqueros"
import type { ServicioItem } from "../home/Servicio"
import {CalendarioDias} from "./Calendar"
import Foto3 from "../../assets/foto3.avif";


interface ReservasProps {
  onSelectServicio: (servicio: ServicioItem) => void;
  servicioSeleccionado: ServicioItem | null;
  onSelectPeluquero: (peluquero: PeluqueroItem) => void;
  peluqueroSeleccionado: PeluqueroItem | null;
  step: number;
}

function Reservas({ onSelectServicio, servicioSeleccionado, onSelectPeluquero, peluqueroSeleccionado, step }: ReservasProps) {
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [peluqueros, setPeluqueros] = useState<PeluqueroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

useEffect(() => {
  const fetchPeluqueros = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/persona/peluquero/findAllPeluquero");
      if (!res.ok) throw new Error("Error al cargar los peluqueros");
      const data = await res.json();
      setPeluqueros(data.data || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchPeluqueros();
}, []);

  return (
    <div className="col-lg-8 my-4">
      <div className="reservas-steps mb-4">
        <span className={step === 1 ? "current" : step > 1 ? "active" : ""}>
          Servicios 
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </span>
        <span className={step === 2 ? "current" : step > 2 ? "active" : ""}>
          Profesional
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </span>
        <span className={step === 3 ? "current" : step > 3 ? "active" : ""}>
          Hora
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </span>
        <span className={step === 4 ? "current" : ""}>
          Confirmar
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
                  className={`servicio-btn ${
                  s.nombreServicio === servicioSeleccionado?.nombreServicio ? "selected" : ""
                  }`}
                  onClick={() => onSelectServicio(s)}
                >
                  <strong>+</strong>
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      )
      }
      {step === 2 && (
        <>
              <h2 className="mb-4">Peluqueros</h2>
              <div className="row my-4"> 
                {peluqueros.map((peluquero, index) => (
                  <motion.div key={index} className="col-6 col-md-3 mb-4 d-flex justify-content-start">
                    <div
                      className={`d-flex flex-column align-items-center text-center mt-3 peluquero-card ${
                        peluqueroSeleccionado?.nombre === peluquero.nombre ? "selected" : ""
                      }`}
                    >
                      <motion.img
                        src={Foto3}
                        className="d-block rounded-circle mb-2"
                        style={{ width: "120px", height: "120px", objectFit: "cover", cursor: "pointer" }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onSelectPeluquero(peluquero)}
                      />
                      <h5 className="mb-0">{peluquero.nombre}</h5>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <CalendarioDias />
            </>
          )}
    </div>
  );
}

export default Reservas;
