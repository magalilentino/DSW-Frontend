import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

interface Producto {
  idProducto: number;
  descripcion: string;
  activo: boolean;
  categoria: {
    nombreCategoria: string;
  };
}

export default function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProductos = async () => {
    try {
      const data = await apiFetch("/producto");
      setProductos(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idProducto: number) => {
    if (
      window.confirm(
        `¿Estás seguro que quieres borrar el producto ${idProducto}?`,
      )
    ) {
      try {
        const data = await apiFetch(`/producto/${idProducto}`,
          {
            method: "DELETE",
          },
        );
        
        setSuccessMessage(data.message);

        setProductos((prevProductos) =>
          prevProductos.map((p) =>
            p.idProducto === idProducto ? { ...p, activo: false } : p,
          ),
        );
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="registro-page">
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
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
        <h2>Listado de Productos</h2>
        <button
          className="crear-button"
          onClick={() => navigate("/producto/crear/")}
        >
          Crear Producto
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
              <th>Descripcion</th>
              {/* <th>Marca</th> */}
              <th>Caregoria</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, index) => (
              <tr key={`${p.idProducto}-${index}`}>
                <td>{p.idProducto}</td>
                <td>{p.descripcion}</td>
                {/* <td>{p.nombreMarca}</td> */}
                <td>{p.categoria.nombreCategoria}</td>
                <td>{p.activo ? "Activado" : "Desactivado"}</td>
                <td>
                  <button
                    className="action-button update"
                    onClick={() =>
                      navigate(`/producto/actualizar/${p.idProducto}`)
                    }
                  >
                    Actualizar
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(p.idProducto)}
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
