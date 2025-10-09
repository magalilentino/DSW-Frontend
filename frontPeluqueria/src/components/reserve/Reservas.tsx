import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ServicioItem } from "../home/Servicio";
import type { PeluqueroItem } from "../home/Peluqueros";
import { CalendarioDias } from "./Calendar";
import Foto3 from "../../assets/foto3.avif";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

interface ReservasProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onNextStep: () => void;
  servicios: ServicioItem[];
  serviciosSeleccionados: ServicioItem[];
  setServiciosSeleccionados: React.Dispatch<React.SetStateAction<ServicioItem[]>>;
  peluqueroSeleccionado: PeluqueroItem | null;
  setPeluqueroSeleccionado: React.Dispatch<React.SetStateAction<PeluqueroItem | null>>;
  bloquesSeleccionados: { idBloque: number; inicio: string; fin: string }[];
  setBloquesSeleccionados: React.Dispatch<React.SetStateAction<{ idBloque: number; inicio: string; fin: string }[]>>;
}

export default function Reservas({
  step,
  setStep,
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

  const duracionTotal = serviciosSeleccionados.reduce((sum, s) => sum + s.cantTurnos, 0);
  const clienteId = localStorage.getItem("idPersona");

  // ------------------- Función fetch con token -------------------
  const fetchConToken = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token en localStorage");

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  // ------------------- Fetch peluqueros -------------------
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

  // ------------------- Fetch bloques libres -------------------
  useEffect(() => {
    if (peluqueroSeleccionado && diaSeleccionado) {
      const fetchBloques = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/bloque/libres?idPersona=${peluqueroSeleccionado.idPersona}&fecha=${diaSeleccionado}`
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

  // ------------------- Selección servicios -------------------
  const onSelectServicio = (s: ServicioItem) => {
    if (serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio)) {
      setServiciosSeleccionados(prev => prev.filter(serv => serv.nombreServicio !== s.nombreServicio));
    } else {
      setServiciosSeleccionados(prev => [...prev, s]);
    }
    setBloquesSeleccionados([]); // limpiar bloques al cambiar servicios
  };

  // ------------------- Selección peluquero -------------------
  const onSelectPeluquero = (p: PeluqueroItem) => {
    setPeluqueroSeleccionado(p);
    setBloquesSeleccionados([]); // limpiar bloques al cambiar peluquero
  };

// ------------------- Confirmar reserva -------------------
const confirmarReserva = async () => {
  if (!clienteId) {
    alert("Debes iniciar sesión para reservar");
    return;
  }
  if (!peluqueroSeleccionado || serviciosSeleccionados.length === 0 || bloquesSeleccionados.length === 0) {
    alert("Debes seleccionar servicios, peluquero y horario");
    return;
  }

  // 🔹 Validación del día (martes a sábado)
  const dia = dayjs(diaSeleccionado).day(); // 0 = domingo, 1 = lunes
  if (dia === 0 || dia === 1) {
    alert("Solo se pueden reservar turnos de martes a sábado");
    return;
  }

  try {
    const res = await fetchConToken("http://localhost:3000/api/atencion", {
      method: "POST",
      body: JSON.stringify({
        idCliente: Number(clienteId),
        idPeluquero: peluqueroSeleccionado.idPersona,
        idServicios: serviciosSeleccionados.map(s => s.codServicio),
        idBloques: bloquesSeleccionados.map(b => b.idBloque),
        fecha: diaSeleccionado
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Reserva confirmada ✅");
      // Limpiar estado
      setStep(1);
      setServiciosSeleccionados([]);
      setPeluqueroSeleccionado(null);
      setBloquesSeleccionados([]);
      setDiaSeleccionado("");
    } else {
      alert("Error al reservar: " + (data.message || "Error desconocido"));
    }
  } catch (err) {
    console.error(err);
    alert("Error al reservar");
  }
};

  return (
    <div className="col-lg-8 my-4">
      {/* Steps */}
      <div className="reservas-steps mb-4">
        {['Servicios', 'Profesional', 'Hora', 'Confirmar'].map((label, index) => (
          <span key={index} className={step === index + 1 ? "current" : step > index + 1 ? "active" : ""}>
            {label}
            {index < 3 && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6"/>
              </svg>
            )}
          </span>
        ))}
      </div>

      {/* Paso 1: Servicios */}
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
                  <p className="mb-1">Duración: {Math.floor((s.cantTurnos * 45) / 60)}h {(s.cantTurnos * 45) % 60}min</p>
                  <small>{s.precio} ARS</small>
                </div>
                <button
                  type="button"
                  className={`servicio-btn ${serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio) ? "selected" : ""}`}
                  onClick={() => onSelectServicio(s)}
                >
                  {serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio) ? "-" : "+"}
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      )}

      {/* Paso 2: Peluquero */}
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

      {/* Paso 3: Bloques */}
      {step === 3 && serviciosSeleccionados.length > 0 && peluqueroSeleccionado && (
        <div>
          <CalendarioDias diaSeleccionado={diaSeleccionado} onSelectDia={(d) => setDiaSeleccionado(d)} />

          {diaSeleccionado && (
            <div className="bloques-container mt-3 d-flex flex-column gap-2">
              {bloquesLibres.length === 0 ? (
                <p>No hay bloques disponibles para este día.</p>
              ) : (
                bloquesLibres.map((b, i) => {
                  if (i + duracionTotal > bloquesLibres.length) return null;
                  const secuencia = bloquesLibres.slice(i, i + duracionTotal);
                  const consecutivos = secuencia.every((bl, idx) => idx === 0 || bl.inicio === secuencia[idx - 1].fin);
                  if (!consecutivos) return null;

                  const esSeleccionado = bloquesSeleccionados.length > 0 &&
                    bloquesSeleccionados[0].inicio === secuencia[0].inicio &&
                    bloquesSeleccionados[bloquesSeleccionados.length - 1].fin === secuencia[secuencia.length - 1].fin;

                  return (
                    <motion.div
                      key={secuencia[0].idBloque}
                      className="reservas-servicio-item d-flex justify-content-between align-items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    >
                      <span>{secuencia[0].inicio} - {secuencia[secuencia.length - 1].fin}</span>
                      <button
                        className={`servicio-btn ${esSeleccionado ? "selected" : ""}`}
                        onClick={() => setBloquesSeleccionados(
                          esSeleccionado ? [] : secuencia.map(bl => ({ idBloque: bl.idBloque, inicio: bl.inicio, fin: bl.fin }))
                        )}
                      >
                        {esSeleccionado ? "-" : "+"}
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Paso 4: Confirmar */}
      {step === 4 && (
        <button
          onClick={confirmarReserva}
          className="btn btn-primary"
          disabled={!peluqueroSeleccionado || serviciosSeleccionados.length === 0 || bloquesSeleccionados.length === 0}
        >
          Confirmar Reserva
        </button>
      )}
    </div>
  );
}
