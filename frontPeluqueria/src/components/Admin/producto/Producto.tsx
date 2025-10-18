import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface Producto {
  idProducto: number;
  descripcion: string;
  categoria: {
    nombreCategoria: string;
  };
  marcas: {
    nombre: string;
  }[];
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

        setProductos((prev) => prev.filter((p) => p.idProducto !== idProducto));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="admin-servicio my-4 container-fluid">
      <div className="row">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Productos</h2>
            <button className="btn btn-primary" onClick={() => navigate("/producto/crear")}>
              Agregar Producto
            </button>
          </div>
          {error && <p className="text-danger">Error: {error}</p>}
          {productos.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            <ul className="list-unstyled">
              {productos.map((p, i) => (
                <motion.li
                  key={p.idProducto}
                  className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="service-info me-3">
                    <h5>Producto #{p.idProducto}</h5>
                    <p className="mb-1">Descripción: {p.descripcion}</p>
                    <p className="mb-1">Categoría: {p.categoria?.nombreCategoria || "Sin categoría"}</p>
                    <p className="mb-1">Marca: {p.marcas?.[0]?.nombre || "Sin marca"}</p>
                  </div>
                  <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-outline-secondary admin-btn-action"
                      onClick={() => navigate(`/producto/actualizar/${p.idProducto}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark admin-btn-action"
                      onClick={() => handleDelete(p.idProducto)}
                    >
                      Borrar
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}

          

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
