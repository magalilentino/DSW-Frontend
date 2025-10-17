import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

interface Marca {
    idMarca: number;
    nombre: string;
}

interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
}


const CrearProducto: React.FC = () => {
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
      const payload = { descripcion, marcas: marcasIds, categoria: categoriaId };
      const res = await fetch("http://localhost:3000/api/producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear la categoría");
      }

      setSuccess("Categoría creada correctamente");
      setTimeout(() => navigate("/producto"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-container">
      <button
          className="reservas-back-button"
          onClick={() => {window.location.href = "/producto";}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
          </svg>
      </button>
      <h2>Crear nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="crear-form">
        <label htmlFor="descripcion">Descripción del Producto:</label>
        <input
          type="text"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        {/* Desplegable de CATEGORÍA */}
        <label>Categoría:</label>
        <select
            value={categoriaId} 
            onChange={(e) => setCategoriaId(Number(e.target.value))}
        >
            <option value="">Todas las Categorías</option>
            {categorias.map((c) => (
                <option key={c.idCategoria} value={c.idCategoria}>
                    {c.nombreCategoria}
                </option>
            ))}
        </select>

        {/* CheckBox de MARCA */}
        <label>Marcas:</label>
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

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default CrearProducto;