import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin.css";
import { motion } from "framer-motion";
import { apiFetch } from "../../../shared/apiFetch.ts";

interface ProdMar {
  idPM: number;
  producto: {
    descripcion: string;
  };
  marca: {
    nombre: string;
  };
}

interface FormulaItem {
  idPM: number;
  cantidad: number;
}

export default function CrearTono() {
  const [nombre, setNombre] = useState("");
  const [formulaItems, setFormulaItems] = useState<FormulaItem[]>([]);
  const [productosMar, setProductosMar] = useState<ProdMar[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdMar = async () => {
      try {
        const data = await apiFetch("/prodMar")
        setProductosMar(data.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdMar();
  }, []);

  const isSelected = (idPM: number) =>
    formulaItems.some((p) => p.idPM === idPM);

  // Función para manejar la cantidad, añadiendo o quitando de la lista de seleccionados
  const handleCantidadChange = (idPM: number, cantidadStr: string) => {
    const cantidad = parseFloat(cantidadStr.replace(",", ".")); // Soporte para coma/punto
    const productoInfo = productosMar.find((p) => p.idPM === idPM);

    if (!productoInfo) return;

    setFormulaItems((prev) => {
      const index = prev.findIndex((p) => p.idPM === idPM);

      if (cantidad > 0 && !isNaN(cantidad)) {
        if (index > -1) {
          // Actualizar cantidad si ya existe
          const newArray = [...prev];
          newArray[index] = { ...newArray[index], cantidad };
          return newArray;
        } else {
          // Añadir nuevo producto
          return [
            ...prev,
            {
              idPM: idPM,
              cantidad: cantidad,
            },
          ];
        }
      } else {
        // Si la cantidad es 0 o inválida, eliminar de la lista
        return prev.filter((p) => p.idPM !== idPM);
      }
    });
  };

  // Helper para obtener la cantidad actual de un producto
  const getCantidad = (idPM: number) => {
    const item = formulaItems.find((p) => p.idPM === idPM);
    return item ? item.cantidad.toString() : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nombre, formulas: formulaItems };
      const data = await apiFetch("/tono", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(data.message);
      setTimeout(() => navigate("/tono"), 1500);
    } catch (err) {
      setError((err as Error).message);
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
          <h2>Crear Tono</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/tono")}
          >
            Volver
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {success && <p className="text-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre del tono
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Listado de Productos */}
          <label className="mt-4 mb-2">Productos utilizados</label>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Cantidad Utilizada (gr)</th>
              </tr>
            </thead>
            <tbody>
              {productosMar.map((p) => (
                <tr key={p.idPM}>
                  <td>{p.producto.descripcion}</td>
                  <td>{p.marca.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Cantidad"
                      value={getCantidad(p.idPM)}
                      onChange={(e) =>
                        handleCantidadChange(p.idPM, e.target.value)
                      }
                      className={`form-control ${isSelected(p.idPM) ? "border-success" : ""}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Tono"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
