import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface ProdMar {
  idPM: number;
  marca:{
    idMarca: number;
    nombre: string};
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
    fetch("http://localhost:3000/api/categoria")
      .then((res) => res.json())
      .then((data) => setCategorias(data.data || []));

    fetch("http://localhost:3000/api/marca")
      .then((res) => res.json())
      .then((data) => setMarcas(data.data || []));

    fetch(`http://localhost:3000/api/producto/${idProducto}`)
      .then((res) => res.json())
      .then((data) => {
        setDescripcion(data.data.descripcion);
        setCategoriaId(data.data.categoria?.idCategoria || null);
        setActivo(data.data.activo);
        setLoading(false);
      })

    fetch(`http://localhost:3000/api/prodMar/marcasPorProd/${idProducto}`)
      .then((res) => res.json())
      .then((data) => {
        setProdMarcIds(data.data.map((pm: ProdMar) => pm.marca.idMarca));
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el producto.");
        setLoading(false);
      });

  }, [idProducto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = { descripcion, categoria: categoriaId };

    try {
      const res = await fetch(`http://localhost:3000/api/producto/${idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar el producto");

      const res2 = await fetch(`http://localhost:3000/api/prodMar/sincronizarProdMar/${idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({prodMarcIds}),
      });

      const data2 = await res2.json();
      if (!res2.ok) throw new Error(data2.message || "Error al actualizar el producto");

      setSuccess("Producto actualizado correctamente");
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
          <button className="btn btn-secondary" onClick={() => navigate("/producto")}>
            Volver
          </button>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
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
                            : [...prev, id]
                        );
                      }}
                    />
                    <label className="form-check-label">{m.nombre}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="activo" className="form-label">Estado</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="activo"
                  checked={activo}
                  onChange={(e) => {
                    const nuevoEstado = e.target.checked; // esta propiedad siempre devuelve un valor booleano
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

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Producto"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
