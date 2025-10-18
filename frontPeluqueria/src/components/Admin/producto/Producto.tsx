import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

interface Producto {
  idProducto: number;
  descripcion: string;
  activo: boolean;
  categoria: {
    nombreCategoria: string;
  };
  // marcas: {
  //   nombre: string;
  // }[];
}

export default function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleDelete = async (idProducto: number) => {
    if (
      window.confirm(
        `¿Estás seguro que quieres borrar el producto ${idProducto}? Esta acción es irreversible.`
      )
    ) {
      try {
        const res = await fetch(`http://localhost:3000/api/producto/${idProducto}`, {
          method: "DELETE",
        });

        const data = await res.json();

        //if (!res.ok) throw new Error("Error al borrar el producto");
        //if (!res.ok) throw new Error(data.message || "Error al borrar el producto");
        if (!res.ok) setError(data.message || "Error al borrar el producto");

        setProductos((prev) =>
          prev.map((p) =>
            p.idProducto === idProducto ? { ...p, activo: false } : p
          )
        );

      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // const productosExpandido = productos.flatMap((p) =>
  //   p.marcas.map((marca) => ({
  //     idProducto: p.idProducto,
  //     descripcion: p.descripcion,
  //     nombreCategoria: p.categoria.nombreCategoria,
  //     nombreMarca: marca.nombre,
  //     activo: p.activo ? "Activado" : "Desactivado",
  //   }))
  // );

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

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
        <button className="crear-button" onClick={() => navigate("/producto/crear/")}>
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
                  onClick={() => navigate(`/producto/actualizar/${p.idProducto}`)}
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

            {/* {productos.map((p) => (
              <tr key={p.idProducto}>
                <td>{p.idProducto}</td>
                <td>{p.descripcion}</td>
                {/* <td>{p.marcas.nombre}</td> 
                <td>{p.categoria.nombreCategoria}</td>
                <td>
                  <button className="action-button update" onClick={() => navigate(`/marca/actualizar/${p.idProducto}`)}>
                    Actualizar
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(p.idProducto)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      )}
    </div>
  );
}
