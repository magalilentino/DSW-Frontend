import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin.css";
import { motion } from "framer-motion";

interface ProdMar {
  idPM: number;
  producto: {
    descripcion: string};
  marca: {
    nombre: string};
}


export default function CrearTono() {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState<number>();
  const [productoIds, setProductoIds] = useState<number[]>([]);
  const [productosMar, setProductosMar] = useState<ProdMar[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      fetch("http://localhost:3000/api/prodMar")
        .then((res) => res.json())
        .then((data) => setProductosMar(data.data || []));
    }, []);
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resTono = await fetch("http://localhost:3000/api/tono", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!resTono.ok) throw new Error("Error al crear el tono");

      const resFor = await fetch("http://localhost:3000/api/formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!resFor.ok) throw new Error("Error al crear la fórmula");

      setSuccess("Tono creado correctamente");
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
          <button className="btn btn-secondary" onClick={() => navigate("/tono")}>
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Marca"}
          </button>
        </form>
      </motion.div>
    </div>
    // <div className="container my-4">
    //   <h2>Crear Tono</h2>
    //   <form onSubmit={handleSubmit} className="mt-3">
    //     <div className="mb-3">
    //       <label htmlFor="nombre" className="form-label">Nombre del tono</label>
    //       <input
    //         type="text"
    //         id="nombre"
    //         className="form-control"
    //         value={nombre}
    //         onChange={(e) => setNombre(e.target.value)}
    //         required
    //       />
    //     </div>
    //     {error && <p className="text-danger">{error}</p>}
    //     <div className="d-flex justify-content-between">
    //       <button type="submit" className="btn btn-success">Crear</button>
    //       <button type="button" className="btn btn-secondary" onClick={() => navigate("/tono")}>
    //         Cancelar
    //       </button>
    //     </div>
    //   </form>
    // </div>
  );
}
