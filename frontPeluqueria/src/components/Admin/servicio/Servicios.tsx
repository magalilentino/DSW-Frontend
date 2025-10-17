import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin.css";

export interface ServicioItem {
  codServicio: number;
  nombreServicio: string;
  descripcion: string;
  cantTurnos: number;
  precio: number;
}

const formatDuration = (cantTurnos: number): string => {
  const totalMinutes = cantTurnos * 45;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours} h${minutes > 0 ? ` ${minutes} min` : ""}`;
  }
  return `${minutes} min`;
};

function Servicios() {
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/servicio/crear");
  };

  const handleEdit = (codServicio: number) => {
    const servicioAEditar = servicios.find((s) => s.codServicio === codServicio);
    if (servicioAEditar) {
      navigate(`/servicio/actualizar/${codServicio}`);
    } else {
      console.error(
        `Error: Servicio con ID ${codServicio} no encontrado en el estado local.`
      );
    }
  };

  const handleDelete = async (codServicio: number) => {
    if (
      window.confirm(
        `¿Estás seguro que quieres borrar el servicio con código ${codServicio}? Esta acción es irreversible.`
      )
    ) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/servicio/delete/${codServicio}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) {
          throw new Error(res.statusText);
          throw new Error("Error al borrar el servicio");
        }
        setServicios((prev) =>
          prev.filter((s) => s.codServicio !== codServicio)
        );
        console.log(`Servicio ${codServicio} eliminado con éxito.`);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/servicio/findAll")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar servicios");
        return res.json();
      })
      .then((data) => setServicios(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Cargando servicios...</p>;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-servicio my-4 container-fluid">
      <div className="row">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Servicios</h2>
            <button
              className="admin-btn-agregar"
              onClick={handleAdd}
            >
              Agregar Servicio
            </button>
          </div>
          {servicios.length === 0 ? (
            <p>No hay servicios disponibles.</p>
          ) : (
            <ul className="list-unstyled">
              {servicios.map((s) => (
                <li
                  key={s.codServicio}
                  className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3"
                >
                  <div className="service-info me-3">
                    <h5>{s.nombreServicio}</h5>
                    <p className="mb-1">
                      <span className="fw-normal">{s.descripcion}</span>
                    </p>
                    <p className="mb-1">
                      Duración: {formatDuration(s.cantTurnos)}
                    </p>
                    <small className="text-muted">{s.precio} ARS</small>
                  </div>
                  <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-outline-secondary admin-btn-action"
                      onClick={() => handleEdit(s.codServicio)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark admin-btn-action"
                      onClick={() => handleDelete(s.codServicio)}
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
export default Servicios;