import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

interface ProdMar {
  idPM: number;
  marca: {
    idMarca: number;
    nombre: string;
  };
}

interface Marca {
  idMarca: number;
  nombre: string;
}

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export default function ActualizarProducto() {
  const { idProducto } = useParams();
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState<boolean>();
  const [prodMarcIds, setProdMarcIds] = useState<number[]>([]);
  const [categoriaId, setCategoriaId] = useState<number>();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Categorías
        const categoriasData = await apiFetch("/categoria");
        setCategorias(categoriasData.data || []);

        // Marcas
        const marcasData = await apiFetch("/marca");
        setMarcas(marcasData.data || []);

        // Producto
        const productoData = await apiFetch(`/producto/${idProducto}`);
        setDescripcion(productoData.data.descripcion);
        setCategoriaId(productoData.data.categoria?.idCategoria || null);
        setActivo(productoData.data.activo);

        // ProdMar
        const prodMarData = await apiFetch(`/prodMar/marcasPorProd/${idProducto}`);
        setProdMarcIds(prodMarData.data.map((pm: ProdMar) => pm.marca.idMarca));
      } catch (err) {
        setError((err as Error).message || "No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProducto]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = { descripcion, categoria: categoriaId };

    try {
      const data = await apiFetch(`/producto/${idProducto}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );

      const data2 = await apiFetch(`/prodMar/sincronizarProdMar/${idProducto}`,
        {
          method: "PUT",
          body: JSON.stringify({ prodMarcIds }),
        },
      );

      setSuccess(data2.message);
      setTimeout(() => navigate("/producto"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-servicio my-4 container-fluid">
      <motion.div
        className="card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Actualizar Producto</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/producto")}
          >
            Volver
          </button>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={categoriaId}
                onChange={(e) => setCategoriaId(Number(e.target.value))}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => (
                  <option key={c.idCategoria} value={c.idCategoria}>
                    {c.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Marcas</label>
              <div className="d-flex flex-wrap gap-2">
                {marcas.map((m) => (
                  <div key={m.idMarca} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={m.idMarca}
                      checked={prodMarcIds.includes(m.idMarca)}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setProdMarcIds((prev) =>
                          prev.includes(id)
                            ? prev.filter((pid) => pid !== id)
                            : [...prev, id],
                        );
                      }}
                    />
                    <label className="form-check-label">{m.nombre}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="activo" className="form-label">
                Estado
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="activo"
                  checked={activo}
                  onChange={(e) => {
                    const nuevoEstado = e.target.checked;
                    setActivo(nuevoEstado);
                  }}
                />
                <label className="form-check-label" htmlFor="activo">
                  Activo
                </label>
              </div>
            </div>

            {error && <p className="text-danger">Error: {error}</p>}
            {success && <p className="text-success">{success}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Producto"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
