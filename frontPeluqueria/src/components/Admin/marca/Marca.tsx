import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

interface Marca {
  idMarca: number;
  nombre: string;
}

export default function MarcaPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMarcas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/marca");
      if (!res.ok) throw new Error("Error al cargar marcas");
      const data = await res.json();
      setMarcas(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idMarca: number) => {
    if (
      window.confirm(`¿Estás seguro que quieres borrar la marca ${idMarca}?`)
    ) {
      try {
        setError(null);
        setSuccessMessage(null);

        const res = await fetch(`http://localhost:3000/api/marca/${idMarca}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.mensaje || "Error al eliminar la marca");
        }

        setSuccessMessage(data.mensaje);
        setMarcas((prev) => prev.filter((m) => m.idMarca !== idMarca));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  if (loading) return <p>Cargando marcas...</p>;

  return (
    <div className="registro-page">
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="registro-header">
        <button
          className="reservas-back-button"
          onClick={() => {
            window.location.href = "/admin";
          }}
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
        <h2>Listado de Marcas</h2>
        <button
          className="crear-button"
          onClick={() => navigate("/marca/crear/")}
        >
          Crear Marca
        </button>
      </div>

      <table className="registro-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((m) => (
            <tr key={m.idMarca}>
              <td>{m.idMarca}</td>
              <td>{m.nombre}</td>
              <td>
                <button
                  className="action-button update"
                  onClick={() => navigate(`/marca/actualizar/${m.idMarca}`)}
                >
                  Actualizar
                </button>
                <button
                  className="action-button delete"
                  onClick={() => handleDelete(m.idMarca)}
                >
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
