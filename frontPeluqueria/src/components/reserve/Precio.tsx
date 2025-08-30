import type { ServicioItem } from "./Reservas";

interface PrecioProps {
  servicio: ServicioItem | null;
}

function Precio({ servicio }: PrecioProps) {
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
        <button className="btn btn-reservar-general w-100 mb-3 text-light bg-dark">
          Continuar
        </button>
      </div>
    </div>
  );
}

export default Precio;