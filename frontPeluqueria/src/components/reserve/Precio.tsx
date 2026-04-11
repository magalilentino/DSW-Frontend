import { useState } from "react";
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
  const navigate = useNavigate();

  const totalPrecio = serviciosSeleccionados.reduce(
    (sum, s) => sum + (s.precio ?? 0),
    0,
  );
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

    if (
      !peluquero ||
      bloquesSeleccionados.length === 0 ||
      serviciosSeleccionados.length === 0 ||
      !diaSeleccionado ||
      !clienteIdString ||
      !token
    ) {
      alert("Faltan datos para confirmar la reserva o no has iniciado sesión.");
      return;
    }

    const payload = {
      clienteId: parseInt(clienteIdString),
      peluqueroId: peluquero.idPersona,
      fecha: diaSeleccionado,
      horaInicio: bloquesSeleccionados[0].inicio,
      duracion: totalDuracionMin,
      servicios: serviciosSeleccionados.map((s) => s.codServicio),
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

      if (!res.ok) {
        throw new Error(`Error en la petición: ${res.statusText}`);
      }

      await res.json();

      setStep(4);
      setShowModal(true);
    } catch (err) {
      console.error("Error al crear atención:", err);
      alert("Hubo un error al confirmar la reserva. Inténtalo de nuevo.");
    }
  };

  const handleContinue = () => {
    if (step === 3) {
      confirmarReserva();
    } else {
      onNextStep();
    }
  };

  const isButtonDisabled =
    (step === 1 && serviciosSeleccionados.length === 0) ||
    (step === 2 && !peluquero) ||
    (step === 3 && bloquesSeleccionados.length === 0);

  const closeModalAndGoHome = () => {
    setShowModal(false);
    navigate("/"); // Redirige al home
  };

  return (
    <div className="col-lg-4">
      <div className="border p-3 rounded">
        <h2 className="mb-2">Resumen de la Reserva</h2>

        {serviciosSeleccionados.length === 0 ? (
          <p>No hay servicios seleccionados</p>
        ) : (
          serviciosSeleccionados.map((s) => (
            <div
              key={s.codServicio}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <div>
                <h6>{s.nombreServicio}</h6>
                <small>
                  Duración: {Math.floor((s.cantTurnos * 45) / 60)}h{" "}
                  {(s.cantTurnos * 45) % 60}min
                </small>
                <br />
                <small>{s.precio} ARS</small>
              </div>
              <button
                type="button"
                className="servicio-btn selected"
                onClick={() => onSelectServicio(s)}
                aria-label={`Quitar ${s.nombreServicio}`}
              >
                -
              </button>
            </div>
          ))
        )}

        <hr />
        <h6>Total: {totalPrecio} ARS</h6>
        <small>
          Duración total: {horas}h {minutos}min
        </small>
        {peluquero && <h6 className="mt-2">Peluquero: {peluquero.nombre}</h6>}
        {bloquesSeleccionados.length > 0 && (
          <h6 className="mt-2">
            Horario: {bloquesSeleccionados[0].inicio} -{" "}
            {bloquesSeleccionados[bloquesSeleccionados.length - 1].fin}
          </h6>
        )}
      </div>

      <button
        className="servicio-continuar-btn mt-3 w-100"
        disabled={isButtonDisabled}
        onClick={handleContinue}
      >
        {step === 3 ? "Confirmar Reserva" : "Continuar"}
      </button>

      {showModal && (
        <>
          {/* Fondo oscuro */}
          <div
            className="modal-backdrop show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1040,
            }}
          />

          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reserva Confirmada</h5>
                </div>
                <div className="modal-body">
                  <p>¡Tu reserva se ha confirmado con éxito!</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="servicio-continuar-btn w-100"
                    onClick={closeModalAndGoHome}
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
