import React, { useEffect, useState } from "react";
import "../../../styles/Registros.css";

interface Marca {
  idMarca: number;
  nombre: string;
}

const Marca: React.FC = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  
    useEffect(() => {
    fetch("http://localhost:3000/api/marca")
        .then((res) => res.json())
        .then((data) => {
            console.log("Respuesta de marcas:", data);
            setMarcas(data.data); 
            setLoading(false);
    })
        .catch(() => {
            setError("No se pudo cargar la lista de marcas");
            setLoading(false);
    });
    }, []);

  const handleEliminar = async (idMarca: number) => {
    try {
      await fetch(`http://localhost:3000/api/marca/${idMarca}`, {
        method: "DELETE",
      });
      setMarcas((prev) => prev.filter((m) => m.idMarca !== idMarca));
    } catch {
      alert("Error al eliminar la marca.");
    }
  };

  const handleActualizar = (idMarca: number) => {
    window.location.href = `/marca/actualizar/${idMarca}`;
  };

  const handleCrear = () => {
    window.location.href = "/marca/crear";
  };

  return (
    <div className="registro-page">
      <div className="registro-header">
        <button
            className="reservas-back-button"
            onClick={() => {window.location.href = "/admin";}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
            </svg>
        </button>
        <h2>Listado de Marcas</h2>

        <button className="crear-button" onClick={handleCrear}>
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
                  <button className="action-button update" onClick={() => handleActualizar(m.idMarca)}>
                    Actualizar
                  </button>
                  <button className="action-button delete" onClick={() => handleEliminar(m.idMarca)}>
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
};

export default Marca;