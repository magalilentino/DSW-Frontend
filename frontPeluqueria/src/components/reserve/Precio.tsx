import type { ServicioItem } from "../home/Servicio.tsx";
import type { PeluqueroItem } from "../home/Peluqueros.tsx";

interface PrecioProps {
  servicio: ServicioItem | null;
  peluquero: PeluqueroItem | null;
  onNextStep: () => void;
  step: number;
}

function Precio({ servicio, peluquero, step, onNextStep }: PrecioProps) {
  return (
    <div className="col-lg-4">
      <div className="border p-3 rounded">
          <h2 className="mb-2">Total</h2>
          {servicio ? (
            <>
            <h6 className="d-flex justify-content-between mb-0">
              <span>{servicio.nombreServicio}</span>
              <span>{servicio.precio} ARS</span>
            </h6>
            <small className="text-muted"> 
              Duración de {Math.floor((servicio.cantTurnos * 40) / 60)} h{" "}
              {(servicio.cantTurnos * 40) % 60} min
            </small>
            </>
          ) : (
            <p>No hay servicio seleccionado</p>
          )}
          {peluquero && (
            <h6 className="d-flex justify-content-between mt-3">
              <span>Peluquero: {peluquero.nombre}</span>
            </h6>
          )}
      </div>
      <button
        className="servicio-continuar-btn mb-3"
        disabled={
          (step === 1 && !servicio) ||  // Paso 1: necesita servicio
          (step === 2 && !peluquero)    // Paso 2: necesita peluquero
        }
        onClick={onNextStep}
      >
        Continuar
      </button>
    </div>
  );
}

export default Precio;        