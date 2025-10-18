import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface Marca {
  idMarca: number;
  nombre: string;
}

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export default function CrearProducto() {
  const [descripcion, setDescripcion] = useState("");
  const [marcasIds, setMarcasIds] = useState<number[]>([]);
  const [categoriaId, setCategoriaId] = useState<number>();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/categoria")
      .then((res) => res.json())
      .then((data) => setCategorias(data.data || []));

    fetch("http://localhost:3000/api/marca")
      .then((res) => res.json())
      .then((data) => setMarcas(data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = { descripcion, categoria: categoriaId };
      const res = await fetch("http://localhost:3000/api/producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear el producto");
      }
      const idProducto = data.data.idProducto;
      const res2 = await fetch(`http://localhost:3000/api/prodMar/${idProducto}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({marcasIds}),
      });

      const data2 = await res2.json();

      if (!res2.ok) {
        throw new Error(data2.message || "Error al crear el producto");
      }

      setSuccess("Producto creado correctamente");
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
          <h2>Crear Producto</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/producto")}>
            Volver
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {success && <p className="text-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción del producto
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
                    checked={marcasIds.includes(m.idMarca)}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setMarcasIds((prev) =>
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Producto"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
