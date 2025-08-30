import type { ServicioItem } from "../home/Servicio.tsx";

interface PrecioProps {
  servicio: ServicioItem | null;
  onNextStep: () => void;
}

function Precio({ servicio, onNextStep }: PrecioProps) {
  return (
    <div className="col-lg-4">
      <div className="border p-3 rounded">
        <div>
          <h2>Total</h2>
          <div className="d-flex mb-2"></div>
          <span className="badge badge-outline-success text-success mb-3">
            {servicio ? (
              <p>Servicio seleccionado: {servicio.nombreServicio}</p>
            ) : (
              <p>No hay servicio seleccionado</p>
            )}
          </span>
        </div>
        <button
          className="servicio-continuar-btn mb-3"
          disabled={!servicio}
          onClick={() => servicio && onNextStep()}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default Precio;