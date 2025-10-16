import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface Producto {
  idProducto: number;
  descripcion: string;
}

interface Tono {
  idTono: number;
  nombre: string;
}

export default function CrearFormula() {
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState<number>(0);
  const [productoIds, setProductoIds] = useState<number[]>([]);
  const [tonoId, setTonoId] = useState<number>(1);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tonos, setTonos] = useState<Tono[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/producto")
      .then((res) => res.json())
      .then((data) => setProductos(data.data || []));

    fetch("http://localhost:3000/api/tono")
      .then((res) => res.json())
      .then((data) => setTonos(data.data || []));
  }, []);

  const handleSubmit = async () => {
    const payload = { cantidad, productos: productoIds, tono: tonoId };
    try {
      const res = await fetch("http://localhost:3000/api/formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear fórmula");
      navigate("/formula");
    } catch (err) {
      setError((err as Error).message);
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
          <h2>Crear Fórmula</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/formula")}>
            Volver
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}

        <div className="mb-3">
          <label className="form-label">Cantidad</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tono</label>
          <select
            className="form-select"
            value={tonoId}
            onChange={(e) => setTonoId(Number(e.target.value))}
          >
            {tonos.map((t) => (
              <option key={t.idTono} value={t.idTono}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Productos</label>
          <div className="d-flex flex-wrap gap-2">
            {productos.map((p) => (
              <div key={p.idProducto} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={p.idProducto}
                  checked={productoIds.includes(p.idProducto)}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setProductoIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((pid) => pid !== id)
                        : [...prev, id]
                    );
                  }}
                />
                <label className="form-check-label">{p.descripcion}</label>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Crear Fórmula
        </button>
      </motion.div>
    </div>
  );
}
