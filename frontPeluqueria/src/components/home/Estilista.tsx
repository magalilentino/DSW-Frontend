import Foto3 from "../../assets/foto3.avif";
import { useEffect, useState } from "react";

interface PeluqueroItem {
  nombre: string;
}
function Estilista() {
  const [peluqueros, setPeluqueros] = useState<PeluqueroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch("http://localhost:3000/api/persona/peluquero/findAllPeluquero")
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar los peluqueros");
      return res.json();
    })
    .then((data) => {
      console.log(data); // <--- revisa qué estructura tiene la respuesta
      setPeluqueros(data.data || data); // usa `data` si no hay `data.data`
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, []);


if (loading) return <p>Cargando peluqueros...</p>;
if (error) return <p>Error: {error}</p>;

return (
  <section className="container text-center my-4">
    <h2 className="mb-4">Peluqueros</h2>
    <div className="row justify-content-center">
      {peluqueros.map((peluquero, index) => (
        <div key={index} className="col-6 col-md-3 mb-4">
          <div className="position-relative d-inline-block">
            <img
              src={Foto3}
              className="rounded-circle img-fluid"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          </div>
          <h5 className="mt-3">{peluquero.nombre}</h5>
        </div>
      ))}
    </div>
  </section>
);
}

export default Estilista;