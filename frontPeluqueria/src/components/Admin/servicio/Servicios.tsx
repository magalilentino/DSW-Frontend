import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

export interface ServicioItem {
  codServicio: number;
  nombreServicio: string;
  descripcion: string;
  cantTurnos: number;
  precio: number;
  activo: boolean;
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

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchServicios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/servicio/findAllAyD");
      if (!res.ok) throw new Error("Error al cargar servicios");
      const data = await res.json();
      setServicios(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (codServicio: number) => {
    if (
      window.confirm(
        `¿Estás seguro que quieres borrar el servicio con código ${codServicio}? Esta acción es irreversible.`
      )
    ) {
      try {
        const res = await fetch(`http://localhost:3000/api/servicio/delete/${codServicio}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al borrar el servicio");
        const data = await res.json();
        setSuccessMessage(data.message);
        setServicios((prev) => prev.filter((s) => s.codServicio !== codServicio));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  return (
      
    <div className="registro-page">
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      <div className="registro-header">
        <button
          className="reservas-back-button"
          onClick={() => { window.location.href = "/admin"; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2>Listado de Servicios</h2>
        <button className="crear-button" onClick={() => navigate("/servicio/crear")}>
          Crear Servicio
        </button>
      </div>

      {loading ? (
        <p>Cargando servicios...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="registro-table">
          <thead>
            <tr>
              <th>Cod</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s, index) => (
              <tr key={`${s.codServicio}-${index}`}>
                <td>{s.codServicio}</td>
                <td>{s.nombreServicio}</td>
                <td>{s.descripcion}</td>
                <td>{formatDuration(s.cantTurnos)}</td>
                <td>{s.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })} ARS</td>
                <td>{s.activo ? "Activado" : "Desactivado"}</td>
                <td>
                  <button
                    className="action-button update"
                    onClick={() => navigate(`/servicio/actualizar/${s.codServicio}`)}
                  >
                    Actualizar
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(s.codServicio)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    // <div className="admin-servicio my-4 container-fluid">
    //   <div className="row">
    //     <div>
    //       <div className="d-flex justify-content-between align-items-center mb-3">
    //         <h2>Servicios</h2>
    //         <button className="btn btn-primary" onClick={() => navigate("/servicio/crear")}>
    //           Agregar Servicio
    //         </button>
    //       </div>

    //       {loading && <p>Cargando servicios...</p>}
    //       {error && <p className="text-danger">Error: {error}</p>}

    //       {!loading && !error && (
    //         <>
    //           {servicios.length === 0 ? (
    //             <p>No hay servicios disponibles.</p>
    //           ) : (
    //             <ul className="list-unstyled">
    //               {servicios.map((s, i) => (
    //                 <motion.li
    //                   key={s.codServicio}
    //                   className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
    //                   initial={{ opacity: 0, y: 20 }}
    //                   whileInView={{ opacity: 1, y: 0 }}
    //                   viewport={{ once: false, amount: 0.2 }}
    //                   transition={{ duration: 0.5, delay: i * 0.1 }}
    //                 >
    //                   <div className="service-info me-3">
    //                     <h5>{s.nombreServicio}</h5>
    //                     <p className="mb-1">{s.descripcion}</p>
    //                     <p className="mb-1">Duración: {formatDuration(s.cantTurnos)}</p>
    //                     <small className="text-muted">{s.precio} ARS</small>
    //                   </div>
    //                   <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
    //                     <button
    //                       className="btn btn-sm btn-outline-secondary admin-btn-action"
    //                       onClick={() => navigate(`/servicio/actualizar/${s.codServicio}`)}
    //                     >
    //                       Editar
    //                     </button>
    //                     <button
    //                       className="btn btn-sm btn-outline-dark admin-btn-action"
    //                       onClick={() => handleDelete(s.codServicio)}
    //                     >
    //                       Borrar
    //                     </button>
    //                   </div>
    //                 </motion.li>
    //               ))}
    //             </ul>
    //           )}
    //           <div className="d-flex justify-content-end mt-4">
    //             <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
    //               Volver
    //             </button>
    //           </div>
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
