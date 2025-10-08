import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ServicioItem } from "../home/Servicio";
import type { PeluqueroItem } from "../home/Peluqueros";
import { CalendarioDias } from "./Calendar";
import Foto3 from "../../assets/foto3.avif";

interface ReservasProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>; // agregado
  onNextStep: () => void;
  servicios: ServicioItem[];
  serviciosSeleccionados: ServicioItem[];
  setServiciosSeleccionados: React.Dispatch<React.SetStateAction<ServicioItem[]>>;
  peluqueroSeleccionado: PeluqueroItem | null;
  setPeluqueroSeleccionado: React.Dispatch<React.SetStateAction<PeluqueroItem | null>>;
  bloquesSeleccionados: { inicio: string; fin: string }[];
  setBloquesSeleccionados: React.Dispatch<React.SetStateAction<{ inicio: string; fin: string }[]>>;
}

export default function Reservas({
  step,
  servicios,
  serviciosSeleccionados,
  setServiciosSeleccionados,
  peluqueroSeleccionado,
  setPeluqueroSeleccionado,
  bloquesSeleccionados,
  setBloquesSeleccionados,
}: ReservasProps) {
  const [peluqueros, setPeluqueros] = useState<PeluqueroItem[]>([]);
  const [bloquesLibres, setBloquesLibres] = useState<{ idBloque: number; inicio: string; fin: string }[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");

  useEffect(() => {
    const fetchPeluqueros = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/persona/peluquero/findAllPeluquero");
        if (!res.ok) throw new Error("Error al cargar peluqueros");
        const data = await res.json();
        setPeluqueros(data.data || data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPeluqueros();
  }, []);

  useEffect(() => {
    if (peluqueroSeleccionado && diaSeleccionado) {
      const fetchBloques = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/turno/disponibles?peluqueroId=${peluqueroSeleccionado.idPersona}&fecha=${diaSeleccionado}`
          );
          const data = await res.json();
          setBloquesLibres(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchBloques();
    }
  }, [peluqueroSeleccionado, diaSeleccionado]);

  const onSelectServicio = (s: ServicioItem) => {
    if (serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio)) {
      setServiciosSeleccionados(prev => prev.filter(serv => serv.nombreServicio !== s.nombreServicio));
    } else {
      setServiciosSeleccionados(prev => [...prev, s]);
    }
  };

  const onSelectPeluquero = (p: PeluqueroItem) => {
    setPeluqueroSeleccionado(p);
    setBloquesSeleccionados([]);
  };

  const duracionTotal = serviciosSeleccionados.reduce((sum, s) => sum + s.cantTurnos, 0);

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
                    Duración: {Math.floor((s.cantTurnos * 45) / 60)}h {(s.cantTurnos * 45) % 60}min
                  </p>
                  <small>{s.precio} ARS</small>
                </div>
                <button
                  type="button"
                  className={`servicio-btn ${
                    serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio) ? "selected" : ""
                  }`}
                  onClick={() => onSelectServicio(s)}
                >
                  {serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio) ? "-" : "+"}
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
                  peluqueroSeleccionado?.nombre === p.nombre ? "selected" : ""
                }`}
              >
                <motion.img
                  src={Foto3}
                  className="d-block rounded-circle mb-2"
                  style={{ width: "120px", height: "120px", objectFit: "cover", cursor: "pointer" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => onSelectPeluquero(p)}
                />
                <h5 className="mb-0">{p.nombre}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {step === 3 && serviciosSeleccionados.length > 0 && peluqueroSeleccionado && (
<div>
  <CalendarioDias diaSeleccionado={diaSeleccionado} onSelectDia={setDiaSeleccionado} />

  {diaSeleccionado && (
    <div className="bloques-container mt-3 d-flex flex-column gap-2">
      {bloquesLibres.length === 0 ? (
        <p>No hay bloques disponibles para este día.</p>
      ) : (
        bloquesLibres.map((b, i) => {
          let consecutivos = true;
          for (let j = 1; j < duracionTotal; j++) {
            if (!bloquesLibres[i + j] || bloquesLibres[i + j].inicio !== bloquesLibres[i + j - 1].fin) {
              consecutivos = false;
              break;
            }
          }
          if (!consecutivos) return null;

          const esSeleccionado = bloquesSeleccionados.some(
            bs =>
              bs.inicio === bloquesLibres[i].inicio &&
              bs.fin === bloquesLibres[i + duracionTotal - 1].fin
          );

          return (
            <motion.div
              key={b.idBloque}
              className="reservas-servicio-item d-flex justify-content-between align-items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <span>
                {bloquesLibres[i].inicio} - {bloquesLibres[i + duracionTotal - 1].fin}
              </span>
              <button
                className={`servicio-btn ${esSeleccionado ? "selected" : ""}`}
                onClick={() =>
                  setBloquesSeleccionados(
                    bloquesLibres
                      .slice(i, i + duracionTotal)
                      .map(bl => ({ inicio: bl.inicio, fin: bl.fin }))
                  )
                }
              >
                {esSeleccionado ? "+" : "+"}
              </button>
            </motion.div>
          );
        })
      )}
    </div>
  )}
</div>
      )}
    </div>
  );
}