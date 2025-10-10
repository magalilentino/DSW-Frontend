import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ServicioItem } from "../home/Servicio";
import type { PeluqueroItem } from "../home/Peluqueros";
import { CalendarioDias } from "./Calendar";
import Foto3 from "../../assets/foto3.avif";

interface ReservasProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onNextStep: () => void;
  servicios: ServicioItem[];
  serviciosSeleccionados: ServicioItem[];
  setServiciosSeleccionados: React.Dispatch<React.SetStateAction<ServicioItem[]>>;
  peluqueroSeleccionado: PeluqueroItem | null;
  setPeluqueroSeleccionado: React.Dispatch<React.SetStateAction<PeluqueroItem | null>>;
  setBloquesSeleccionados: React.Dispatch<React.SetStateAction<{ inicio: string; fin: string }[]>>;
  bloquesSeleccionados: { inicio: string; fin: string }[];
  diaSeleccionado: string; 
  setDiaSeleccionado: React.Dispatch<React.SetStateAction<string>>; 
}

export default function Reservas({
  step,
  servicios,
  serviciosSeleccionados,
  setServiciosSeleccionados,
  peluqueroSeleccionado,
  setPeluqueroSeleccionado,
  setBloquesSeleccionados,
  bloquesSeleccionados,
  diaSeleccionado, 
  setDiaSeleccionado, 
}: ReservasProps) {
  const [peluqueros, setPeluqueros] = useState<PeluqueroItem[]>([]);
  const [bloquesDisponibles, setBloquesDisponibles] = useState<{ hora_inicio: string; hora_fin: string }[]>([]);
  const totalDuracionMin = serviciosSeleccionados.reduce((sum, s) => sum + s.cantTurnos * 45, 0);
  const [bloquesDia, setBloquesDia] = useState<{ hora_inicio: string; hora_fin: string; estado: "libre" | "ocupado" }[]>([]);

  

useEffect(() => {
  const fetchBloquesDia = async () => {
    if (!peluqueroSeleccionado || !diaSeleccionado) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/bloque/byFecha?fecha=${diaSeleccionado}&peluqueroId=${peluqueroSeleccionado.idPersona}`
      );
      const data = await res.json();
      setBloquesDia(data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchBloquesDia();
}, [peluqueroSeleccionado, diaSeleccionado]);

  useEffect(() => {
    const fetchPeluqueros = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/persona/peluquero/findAllPeluquero");
        const data = await res.json();
        setPeluqueros(data.data || data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPeluqueros();
  }, []);

  useEffect(() => {
    const fetchBloques = async () => {
      if (!peluqueroSeleccionado || !diaSeleccionado || totalDuracionMin === 0) return;
      try {
        const res = await fetch(
          `http://localhost:3000/api/bloque/disponibles?fecha=${diaSeleccionado}&peluqueroId=${peluqueroSeleccionado.idPersona}&duracionTotal=${totalDuracionMin}`
        );
        const data = await res.json();
        setBloquesDisponibles(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBloques();
  }, [peluqueroSeleccionado, diaSeleccionado, totalDuracionMin]);

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
              <motion.li key={i} className="reservas-servicio-item d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5>{s.nombreServicio}</h5>
                  <p className="mb-1">
                    Duración: {Math.floor((s.cantTurnos * 45) / 60)}h {(s.cantTurnos * 45) % 60}min
                  </p>
                  <small>{s.precio} ARS</small>
                </div>
                <button
                  type="button"
                  className={`servicio-btn ${
                    serviciosSeleccionados.some(serv => serv.codServicio === s.codServicio) ? "selected" : ""
                  }`}
                  onClick={() =>
                    setServiciosSeleccionados(prev =>
                      prev.some(serv => serv.codServicio === s.codServicio)
                        ? prev.filter(serv => serv.codServicio !== s.codServicio)
                        : [...prev, s]
                    )
                  }
                >
                  {serviciosSeleccionados.some(serv => serv.codServicio === s.codServicio) ? "-" : "+"}
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      )}
      {step === 2 && (
        <div className="row my-4">
          {peluqueros.map((p, i) => (
            <motion.div key={i} className="col-6 col-md-3 mb-4 d-flex justify-content-start">
              <div
                className={`d-flex flex-column align-items-center text-center mt-3 peluquero-card ${
                  peluqueroSeleccionado?.idPersona === p.idPersona ? "selected" : ""
                }`}
              >
                <motion.img
                  src={Foto3}
                  className="d-block rounded-circle mb-2"
                  style={{ width: "120px", height: "120px", objectFit: "cover", cursor: "pointer" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setPeluqueroSeleccionado(p)}
                />
                <h5 className="mb-0">{p.nombre}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      )}
{step === 3 && peluqueroSeleccionado && (
  <div>
    <CalendarioDias
      diaSeleccionado={diaSeleccionado}
      onSelectDia={setDiaSeleccionado}
    />
    <h4 className="mt-4">Horarios disponibles</h4>

    <ul className="list-group">
      {bloquesDisponibles.length > 0 ? (
        bloquesDisponibles.map((bloque, i) => {
          const seleccionado = bloquesSeleccionados.some(
            sel => sel.inicio === bloque.hora_inicio && sel.fin === bloque.hora_fin
          );

          return (
            <motion.li
              key={i}
              className="reservas-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div>
                <span className="fw-bold">{bloque.hora_inicio} - {bloque.hora_fin}</span>
              </div>
              <button
                type="button"
                className={`servicio-btn ${seleccionado ? "selected" : ""}`}
                onClick={() => {
                  setBloquesSeleccionados([{ inicio: bloque.hora_inicio, fin: bloque.hora_fin }]);
                }}
              >
                {seleccionado ? "-" : "+"}
              </button>
            </motion.li>
          );
        })
      ) : (
        <p>No hay horarios para este día</p>
      )}
    </ul>
  </div>
)}

    </div>
  );
}