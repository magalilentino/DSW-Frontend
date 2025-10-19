import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/Registros.css";

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  productos: Producto[];
}

interface Producto{
  idProducto: number;
}

export default function CategoriaPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleDelete = async (idCategoria: number, productos: Producto[]) => {
    if (window.confirm(`¿Estás seguro que quieres borrar la categoría ${idCategoria}? también se borrarán los productos contenidos`)) {
      try {
        if(productos){
          for (const p of productos) {
            const resProd = await fetch(`http://localhost:3000/api/producto/${p.idProducto}`, {
              method: "DELETE",
            });

            if (!resProd.ok) {
              const data = await resProd.json();
              throw new Error(`Error al borrar el producto ${p.idProducto}: ${data.message}`);
            }
          }
        }

        const resCat = await fetch(`http://localhost:3000/api/categoria/${idCategoria}`, {
          method: "DELETE",
        });

        if (!resCat.ok) throw new Error("Error al borrar la categoría");
        setCategorias((prev) => prev.filter((c) => c.idCategoria !== idCategoria));
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>Error: {error}</p>;

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
        <h2>Listado de Categorías</h2>
        <button className="crear-button" onClick={() => navigate("/categoria/crear")}>
          Crear Categoría
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
            {categorias.map((c) => (
              <tr key={c.idCategoria}>
                <td>{c.idCategoria}</td>
                <td>{c.nombreCategoria}</td>
                <td>
                  <button className="action-button update" onClick={() => navigate(`/categoria/actualizar/${c.idCategoria}`)}>
                    Actualizar
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(c.idCategoria, c.productos)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  //   <div className="admin-servicio my-4 container-fluid">
  //     <div className="row">
  //       <div>
  //         <div className="d-flex justify-content-between align-items-center mb-3">
  //           <h2>Categorías</h2>
  //           <button className="btn btn-primary" onClick={() => navigate("/categoria/crear")}>
  //             Agregar Categoría
  //           </button>
  //         </div>

  //         {categorias.length === 0 ? (
  //           <p>No hay categorías disponibles.</p>
  //         ) : (
  //           <ul className="list-unstyled">
  //             {categorias.map((c, i) => (
  //               <motion.li
  //                 key={c.idCategoria}
  //                 className="admin-servicio-item d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm bg-white rounded"
  //                 initial={{ opacity: 0, y: 20 }}
  //                 whileInView={{ opacity: 1, y: 0 }}
  //                 viewport={{ once: false, amount: 0.2 }}
  //                 transition={{ duration: 0.5, delay: i * 0.1 }}
  //               >
  //                 <div className="service-info me-3">
  //                   <h5>Categoría #{c.idCategoria}</h5>
  //                   <p className="mb-1">Nombre: {c.nombreCategoria}</p>
  //                 </div>
  //                 <div className="service-actions d-flex flex-column gap-2 flex-shrink-0">
  //                   <button
  //                     className="btn btn-sm btn-outline-secondary admin-btn-action"
  //                     onClick={() => navigate(`/categoria/actualizar/${c.idCategoria}`)}
  //                   >
  //                     Editar
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-outline-dark admin-btn-action"
  //                     onClick={() => handleDelete(c.idCategoria, c.productos)}
  //                   >
  //                     Borrar
  //                   </button>
  //                 </div>
  //               </motion.li>
  //             ))}
  //           </ul>
  //         )}

  //         <div className="d-flex justify-content-end mt-4">
  //           <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
  //             Volver
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
   );
}
