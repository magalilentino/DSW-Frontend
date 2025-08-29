import { useEffect, useState } from "react";

interface ServicioItem {
  nombreServicio: string;
  cantTurnos: number;
  precio?: number; 
}

function Servicio(){
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
  if (servicios.length === 0) return <p>No hay servicios disponibles.</p>;
  
    return (
        <section className="home-servicios my-4">
          <div className="row">
            <div className="col-lg-8">
              <h2>Servicios</h2>
              <ul className="list-group">
                {servicios.slice(0, 4).map((s, i) => (
                <li key={i} className="home-servicio-item d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5>{s.nombreServicio}</h5>
                    <p className="mb-1">Duración: {Math.floor((s.cantTurnos * 40) / 60)} h {(s.cantTurnos * 40) % 60} min</p>
                    <small>{s.precio} ARS</small>
                  </div>
                  <button className="home-btn-reservar">Reservar</button>
                </li>
                ))}
              </ul>
              <button className="home-btn-todo">Ver todo</button>
            </div>

            <div className="col-lg-4">
              <div className="border p-3 rounded">
                <div>
                  <h2>Peluqueria</h2>
                  <div className="d-flex mb-2">
                    <span className="me-2">valoración</span>
                    <span className="text-warning">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <span className="ms-2">(numero de reseñas)</span>
                  </div>
                  <span className="badge home-badge-outline-success text-success mb-3">Ofertas</span>
                </div>
               <button className="home-btn-reservar-general w-100 mb-3">
                  Reservar ahora
                </button>
                <p>
                  <i className="bi-clock me-1"></i>
                  <span className="text-success">Abierto</span> desplegable con horarios
                </p>
                <p>
                  <i className="bi-geo-alt"></i> Calle 123, Rosario, Santa Fe
                  <a href="#" className="link-underline link-underline-opacity-0">Cómo llegar</a>
                </p>
              </div>
            </div>
          </div>
        </section>);
}

export default Servicio;