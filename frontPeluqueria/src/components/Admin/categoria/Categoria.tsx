import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/Registros.css";

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  productos: Producto[];
}

interface Producto {
  idProducto: number;
}

export default function CategoriaPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categoria");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategorias(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idCategoria: number) => {
    if (
      window.confirm(
        `¿Estás seguro que quieres borrar la categoría ${idCategoria}?`,
      )
    ) {
      try {
        setError(null);
        setSuccessMessage(null);

        const res = await fetch(
          `http://localhost:3000/api/categoria/${idCategoria}`,
          {
            method: "DELETE",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.mensaje || "Error al eliminar la categoría");
        }

        setSuccessMessage(data.mensaje);
        setCategorias((prev) =>
          prev.filter((c) => c.idCategoria !== idCategoria),
        );
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  if (loading) return <p>Cargando categorías...</p>;

  return (
    <div className="registro-page">
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

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
        <h2>Listado de Categorías</h2>
        <button
          className="crear-button"
          onClick={() => navigate("/categoria/crear")}
        >
          Crear Categoría
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
          {categorias.map((c) => (
            <tr key={c.idCategoria}>
              <td>{c.idCategoria}</td>
              <td>{c.nombreCategoria}</td>
              <td>
                <button
                  className="action-button update"
                  onClick={() =>
                    navigate(`/categoria/actualizar/${c.idCategoria}`)
                  }
                >
                  Actualizar
                </button>
                <button
                  className="action-button delete"
                  onClick={() => handleDelete(c.idCategoria)}
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
