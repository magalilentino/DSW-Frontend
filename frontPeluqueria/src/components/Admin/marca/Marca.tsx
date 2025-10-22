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
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


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
    if (window.confirm(`¿Estás seguro que quieres borrar la marca ${idMarca}?`)) {
      try {
        const res = await fetch(`http://localhost:3000/api/marca/${idMarca}`, {
          method: "DELETE",
        });
        if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'Error al eliminar la marca');
          }

          const data = await res.json(); // Para obtener el mensaje de éxito del backend
          setSuccessMessage(data.message); // Usa el mensaje de éxito del backend
        
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
  if (error) return <p>Error: {error}</p>;

  return (
     <div className="registro-page">
     
        {successMessage && (
      <div className="alert alert-success">
          {successMessage}
      </div>)} 
      <div className="registro-header">
        <button
            className="reservas-back-button"
            onClick={() => {window.location.href = "/admin";}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
            </svg>
        </button>
        <h2>Listado de Marcas</h2>

        <button className="crear-button" onClick={() => navigate("/marca/crear/")}>
          Crear Marca
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
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
                  <button className="action-button update" onClick={() => navigate(`/marca/actualizar/${m.idMarca}`)}>
                    Actualizar
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(m.idMarca)}>
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
