import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Registros.css";

interface Formula {
  idFormula: number;
  cantidad: number;
  prodMar: {
    producto: { descripcion: string };
    marca: { nombre: string };
  };
}

export default function VerFormulasTono() {
  const { idTono } = useParams();
  const navigate = useNavigate();

  const [nombreTono, setNombreTono] = useState("");
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tonoRes = await fetch(`http://localhost:3000/api/tono/${idTono}`);
        const tonoData = await tonoRes.json();
        setNombreTono(tonoData.data.nombre);

        const formulasRes = await fetch(
          `http://localhost:3000/api/formula/formulasPorTono/${idTono}`,
        );
        const formulasData = await formulasRes.json();
        setFormulas(formulasData.data || []);
      } catch (err) {
        setError("Error al cargar las fórmulas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idTono]);

  return (
    <div className="registro-page">
      <div className="registro-header">
        <button
          className="reservas-back-button"
          onClick={() => navigate("/tono")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2>Fórmulas del Tono {idTono}</h2>
      </div>

      <p className="mb-3">
        <strong>Nombre:</strong> {nombreTono}
      </p>

      {loading ? (
        <p>Cargando fórmulas...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : formulas.length === 0 ? (
        <p>No hay fórmulas asociadas a este tono.</p>
      ) : (
        <table className="registro-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Marca</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {formulas.map((f) => (
              <tr key={f.idFormula}>
                <td>{f.prodMar.producto.descripcion}</td>
                <td>{f.prodMar.marca.nombre}</td>
                <td>{f.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
