import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

interface Descuento {
  idDescuento: number;
  porcentaje: number;
  cantAtencionNecesaria: number;
  estado: boolean;
}

export default function DescuentoPage() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDescuentos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/descuento");
      if (!res.ok) throw new Error("Error al cargar descuentos");
      const data = await res.json();
      setDescuentos(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idDescuento: number) => {
    if (window.confirm(`¿Estás seguro que quieres borrar el descuento ${idDescuento}?`)) {
      try {
        setError(null);
        setSuccessMessage(null);

        const res = await fetch(`http://localhost:3000/api/descuento/${idDescuento}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || "Error al eliminar el descuento");

        setSuccessMessage(data.mensaje);
        setDescuentos((prev) => prev.filter((d) => d.idDescuento !== idDescuento));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, []);

  if (loading) return <p>Cargando descuentos...</p>;

  return (
    <div className="registro-page">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="registro-header">
        <button className="reservas-back-button" onClick={() => navigate("/admin")}>
           {/* SVG de volver igual al de marcas */}
           <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <h2>Configuración de Descuentos</h2>
        <button className="crear-button" onClick={() => navigate("/descuento/crear")}>
          Crear Descuento
        </button>
      </div>

      <table className="registro-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Porcentaje</th>
            <th>Frecuencia (Visitas)</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {descuentos.map((d) => (
            <tr key={d.idDescuento}>
              <td>{d.idDescuento}</td>
              <td>{d.porcentaje}%</td>
              <td>Cada {d.cantAtencionNecesaria}</td>
              <td>{d.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <button className="action-button update" onClick={() => navigate(`/descuento/actualizar/${d.idDescuento}`)}>
                  Actualizar
                </button>
                <button className="action-button delete" onClick={() => handleDelete(d.idDescuento)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}