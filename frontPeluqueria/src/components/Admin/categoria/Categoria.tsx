import React, { useEffect, useState } from "react";
import "../../../styles/Categoria.css";

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

const Categoria: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  
    useEffect(() => {
    fetch("http://localhost:3000/api/categoria")
        .then((res) => res.json())
        .then((data) => {
            console.log("Respuesta de categorías:", data);
            setCategorias(data.data); 
            setLoading(false);
    })
        .catch(() => {
            setError("No se pudo cargar la lista de categorías.");
            setLoading(false);
    });
    }, []);

  const handleEliminar = async (idCategoria: number) => {
    try {
      await fetch(`http://localhost:3000/api/categoria/${idCategoria}`, {
        method: "DELETE",
      });
      setCategorias((prev) => prev.filter((c) => c.idCategoria !== idCategoria));
    } catch {
      alert("Error al eliminar la categoría.");
    }
  };

  const handleActualizar = (idCategoria: number) => {
    window.location.href = `/categoria/actualizar/${idCategoria}`;
  };

  const handleCrear = () => {
    window.location.href = "/categoria/crear";
  };

  return (
    <div className="categoria-page">
      <div className="categoria-header">
        <h2>Listado de Categorías</h2>
        <button className="crear-button" onClick={handleCrear}>
          Crear Categoría
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="categoria-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.idCategoria}>
                <td>{c.idCategoria}</td>
                <td>{c.nombreCategoria}</td>
                <td>
                  <button className="action-button update" onClick={() => handleActualizar(c.idCategoria)}>
                    Actualizar
                  </button>
                  <button className="action-button delete" onClick={() => handleEliminar(c.idCategoria)}>
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

export default Categoria;