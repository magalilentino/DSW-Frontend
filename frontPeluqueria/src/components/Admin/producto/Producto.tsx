import React, { useEffect, useState } from "react";
import "../../../styles/Registros.css";

interface Producto {
  idProducto: number;
  descripcion: string;
  categoria:{
    nombreCategoria: string;
  };
  marcas:{
    nombre: string;
  }[];
}

const Producto: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/producto");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    };

  const handleEliminar = async (idProducto: number) => {
    if (
      window.confirm(
        `¿Estás seguro que quieres borrar el Producto ${idProducto}? Esta acción es irreversible.`
      )
    ) {
      try {
        const res = await fetch(`http://localhost:3000/api/producto/${idProducto}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al borrar la fórmula");
        setProductos((prev) => prev.filter((p) => p.idProducto !== idProducto));   
      } catch {
        setError("Error al eliminar el producto.");
      }
    }
  };

  const handleActualizar = (idProducto: number) => {
    window.location.href = `/producto/actualizar/${idProducto}`;
  };

  const handleCrear = () => {
    window.location.href = "/producto/crear";
  };

  useEffect(() => {
    fetchProductos();
  }, []);

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
        <h2>Listado de Productos</h2>
        <button className="crear-button" onClick={handleCrear}>
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
              <th>Marca</th>
              <th>Caregoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.idProducto}>
                <td>{p.idProducto}</td>
                <td>{p.descripcion}</td>
                <td>{p.marcas?.[0]?.nombre || 'Sin Marca'}</td>
                <td>{p.categoria.nombreCategoria}</td>
                <td>
                  <button className="action-button update" onClick={() => handleActualizar(p.idProducto)}>
                    Actualizar
                  </button>
                  <button className="action-button delete" onClick={() => handleEliminar(p.idProducto)}>
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

export default Producto;