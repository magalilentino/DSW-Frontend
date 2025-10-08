import type { ServicioItem } from "../home/Servicio.tsx";
import type { PeluqueroItem } from "../home/Peluqueros.tsx";

interface PrecioProps {
  peluquero: PeluqueroItem | null;
  bloquesSeleccionados?: { inicio: string; fin: string }[];
  onNextStep: () => void;
  step: number;
  servicios: ServicioItem[];
  serviciosSeleccionados: ServicioItem[];
  setServiciosSeleccionados: React.Dispatch<React.SetStateAction<ServicioItem[]>>;
}

export default function Precio({
  peluquero,
  bloquesSeleccionados = [],
  step,
  onNextStep,
  serviciosSeleccionados,
  setServiciosSeleccionados,
}: PrecioProps) {
  const onSelectServicio = (s: ServicioItem) => {
    if (serviciosSeleccionados.some(serv => serv.nombreServicio === s.nombreServicio)) {
      setServiciosSeleccionados(prev => prev.filter(serv => serv.nombreServicio !== s.nombreServicio));
    } else {
      setServiciosSeleccionados(prev => [...prev, s]);
    }
  };

  const totalPrecio = serviciosSeleccionados.reduce((sum, s) => sum + (s.precio ?? 0), 0);
  const totalDuracionMin = serviciosSeleccionados.reduce((sum, s) => sum + s.cantTurnos * 45, 0);
  const horas = Math.floor(totalDuracionMin / 60);
  const minutos = totalDuracionMin % 60;

  return (
    <div className="col-lg-4">
      <div className="border p-3 rounded">
        <h2 className="mb-2">Servicios seleccionados</h2>

        {serviciosSeleccionados.length === 0 ? (
          <p>No hay servicios seleccionados</p>
        ) : (
          serviciosSeleccionados.map((s, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6>{s.nombreServicio}</h6>
                <small>
                  Duración: {Math.floor((s.cantTurnos * 45) / 60)}h {(s.cantTurnos * 45) % 60}min
                </small>
                <br />
                <small>{s.precio} ARS</small>
              </div>
              <button
                type="button"
                className="servicio-btn selected"
                onClick={() => onSelectServicio(s)}
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
          <div className="mt-2">
            <h6>Horario seleccionado:</h6>
            <p>
              {bloquesSeleccionados[0].inicio} - {bloquesSeleccionados[bloquesSeleccionados.length - 1].fin}
            </p>
          </div>
        )}
      </div>

      <button
        className="servicio-continuar-btn mt-3"
        disabled={(step === 1 && serviciosSeleccionados.length === 0) || (step === 2 && !peluquero) || (step === 3 && bloquesSeleccionados.length === 0)}
        onClick={onNextStep}
      >
        Continuar
      </button>
    </div>
  );
}