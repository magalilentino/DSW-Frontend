import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ServicioItem } from "../home/Servicio.tsx";
import type { PeluqueroItem } from "../home/Peluqueros.tsx";

interface PrecioProps {
  peluquero: PeluqueroItem | null;
  bloquesSeleccionados: { inicio: string; fin: string }[];
  onNextStep: () => void;
  step: number;
  serviciosSeleccionados: ServicioItem[];
  setServiciosSeleccionados: React.Dispatch<
    React.SetStateAction<ServicioItem[]>
  >;
  diaSeleccionado: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Precio({
  peluquero,
  bloquesSeleccionados,
  onNextStep,
  step,
  serviciosSeleccionados,
  setServiciosSeleccionados,
  diaSeleccionado,
  setStep,
}: PrecioProps) {
  const [showModal, setShowModal] = useState(false);
  const [infoDescuento, setInfoDescuento] = useState<{ aplica: boolean; detalle: any | null }>({
    aplica: false,
    detalle: null,
  });
  const navigate = useNavigate();

  // 1. EFECTO: Verificar descuento al llegar al paso 3 (Resumen)
  useEffect(() => {
    const clienteId = localStorage.getItem("idPersona");
    if (step === 3 && clienteId) {
      fetch(`http://localhost:3000/api/atencion/verificar-descuento/${clienteId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.aplicaDescuento) {
            setInfoDescuento({ aplica: true, detalle: data.descuento });
          } else {
            setInfoDescuento({ aplica: false, detalle: null });
          }
        })
        .catch((err) => console.error("Error al verificar descuento:", err));
    }
  }, [step]);

  const subtotal = serviciosSeleccionados.reduce((sum, s) => sum + (s.precio ?? 0), 0);
  
  // 2. CÁLCULO DEL TOTAL CON DESCUENTO
  const montoDescuento = infoDescuento.aplica 
    ? (subtotal * infoDescuento.detalle.porcentaje) / 100 
    : 0;
  const totalPrecio = subtotal - montoDescuento;

  const totalDuracionMin = serviciosSeleccionados.reduce(
    (sum, s) => sum + s.cantTurnos * 45,
    0,
  );
  const horas = Math.floor(totalDuracionMin / 60);
  const minutos = totalDuracionMin % 60;

  const onSelectServicio = (servicio: ServicioItem) => {
    setServiciosSeleccionados((prev) =>
      prev.some((s) => s.codServicio === servicio.codServicio)
        ? prev.filter((s) => s.codServicio !== servicio.codServicio)
        : [...prev, servicio],
    );
  };

  const confirmarReserva = async () => {
    const clienteIdString = localStorage.getItem("idPersona");
    const token = localStorage.getItem("token");

    if (!peluquero || bloquesSeleccionados.length === 0 || serviciosSeleccionados.length === 0 || !diaSeleccionado || !clienteIdString || !token) {
      alert("Faltan datos para confirmar la reserva.");
      return;
    }

    // 3. ENVIAR idDescuento EN EL PAYLOAD
    const payload = {
      clienteId: parseInt(clienteIdString),
      peluqueroId: peluquero.idPersona,
      fecha: diaSeleccionado,
      horaInicio: bloquesSeleccionados[0].inicio,
      duracion: totalDuracionMin,
      servicios: serviciosSeleccionados.map((s) => s.codServicio),
      idDescuento: infoDescuento.aplica ? infoDescuento.detalle.idDescuento : null, // Mandamos el ID al back
    };

    try {
      const res = await fetch("http://localhost:3000/api/atencion/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      setStep(4);
      setShowModal(true);
    } catch (err) {
      console.error("Error al crear atención:", err);
      alert("Error al confirmar reserva.");
    }
  };

  const handleContinue = () => {
    if (step === 3) confirmarReserva();
    else onNextStep();
  };

  const isButtonDisabled =
    (step === 1 && serviciosSeleccionados.length === 0) ||
    (step === 2 && !peluquero) ||
    (step === 3 && bloquesSeleccionados.length === 0);

  const closeModalAndGoHome = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="col-lg-4">
      <div className="border p-3 rounded">
        <h2 className="mb-2">Resumen</h2>

        {serviciosSeleccionados.map((s) => (
          <div key={s.codServicio} className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6>{s.nombreServicio}</h6>
              <small>{s.precio} ARS</small>
            </div>
            {step === 1 && (
              <button type="button" className="servicio-btn selected" onClick={() => onSelectServicio(s)}>-</button>
            )}
          </div>
        ))}

        <hr />
        
        {/* 4. UI DEL DESCUENTO */}
        {infoDescuento.aplica && (
          <div className="alert alert-success p-2 small mb-2">
            <strong>¡Descuento aplicado!</strong> ({infoDescuento.detalle.porcentaje}%) <br/>
            {infoDescuento.detalle.descripcion}
          </div>
        )}

        <div className="d-flex justify-content-between">
            <span>Subtotal:</span>
            <span>{subtotal} ARS</span>
        </div>
        {infoDescuento.aplica && (
            <div className="d-flex justify-content-between text-success">
                <span>Descuento:</span>
                <span>- {montoDescuento} ARS</span>
            </div>
        )}
        <h5 className="mt-2">Total: {totalPrecio} ARS</h5>
        
        <small className="d-block">Duración: {horas}h {minutos}min</small>
        {peluquero && <small className="d-block">Peluquero: {peluquero.nombre}</small>}
        {bloquesSeleccionados.length > 0 && (
          <small className="d-block">Horario: {bloquesSeleccionados[0].inicio} - {bloquesSeleccionados[bloquesSeleccionados.length - 1].fin}</small>
        )}
      </div>

      <button className="servicio-continuar-btn mt-3 w-100" disabled={isButtonDisabled} onClick={handleContinue}>
        {step === 3 ? "Confirmar Reserva" : "Continuar"}
      </button>

      {/* MODAL DE ÉXITO (Sin cambios) */}
      {showModal && (
        <>
          <div className="modal-backdrop show" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }} />
          <div className="modal show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header"><h5 className="modal-title">Reserva Confirmada</h5></div>
                <div className="modal-body"><p>¡Tu reserva se ha confirmado con éxito!</p></div>
                <div className="modal-footer">
                  <button type="button" className="servicio-continuar-btn w-100" onClick={closeModalAndGoHome}>Volver al inicio</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}