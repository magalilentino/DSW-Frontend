import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

interface Tono {
  idTono: number;
  nombre: string;
  formulas: Formula[];
  activo: boolean;
}

interface Formula {
  idFormula: number;
}

export default function TonoPage() {
  const [tonos, setTonos] = useState<Tono[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTonos = async () => {
    try {
      const data = await apiFetch("/tono");
      setTonos(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idTono: number) => {
    if (
      window.confirm(
        `¿Seguro que querés borrar el tono ${idTono}?, también se borrarán sus formulas asociadas`,
      )
    ) {
      try {
        const data = await apiFetch(`/tono/${idTono}`, {
          method: "DELETE",
        });
        setSuccessMessage(data.message);
        setTonos((prev) => prev.filter((t) => t.idTono !== idTono));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchTonos();
  }, []);

  if (loading) return <p>Cargando tonos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="registro-page">
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <div className="registro-header">
        <button
          className="reservas-back-button"
          onClick={() => navigate("/admin")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2>Listado de Tonos</h2>
        <button
          className="crear-button"
          onClick={() => navigate("/tono/crear")}
        >
          Crear Tono
        </button>
      </div>

      {tonos.length === 0 ? (
        <p className="text-muted">No hay tonos disponibles.</p>
      ) : (
        <table className="registro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tonos.map((t, i) => (
              <tr key={t.idTono}>
                <td>{t.idTono}</td>
                <td>{t.nombre}</td>
                <td>{t.activo ? "Activado" : "Desactivado"}</td>
                <td>
                  <button
                    className="action-button view"
                    onClick={() => navigate(`/tono/formulas/${t.idTono}`)}
                  >
                    Ver fórmulas
                  </button>

                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(t.idTono)}
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
  );
}
