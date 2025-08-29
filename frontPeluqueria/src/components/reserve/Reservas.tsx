import { useEffect, useState } from "react";

interface ServicioItem {
  nombreServicio: string;
  cantTurnos: number;
  precio?: number; 
}

function Reservas() {
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/servicio/findAll")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar servicios");
        return res.json();
      })
      .then((data) => setServicios(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando servicios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
            <div className="col-lg-8">
              <h2>Servicios</h2>
              <ul className="list-group">
                {servicios.map((s, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5>{s.nombreServicio}</h5>
                      <p className="mb-1">Duración: {Math.floor((s.cantTurnos * 40) / 60)} h {(s.cantTurnos * 40) % 60} min</p>
                      <small>{s.precio} ARS</small>
                    </div>
                    <button type="button" className="btn btn-outline-dark">+</button>
                  </li>
                ))}
              </ul>
            </div>
  )
}
export default Reservas;
