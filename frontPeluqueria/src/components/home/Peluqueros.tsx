import Foto3 from "../../assets/foto3.avif";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface PeluqueroItem {
  //tipo de dato que tienen los peluqueros
  idPersona: number;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  //fotoUrl?: string; para ponerle la foto que va de cada peluquero
  type?: "peluquero" | "cliente";
}

export function Estilista() {
  const [peluqueros, setPeluqueros] = useState<PeluqueroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/persona/peluquero/findAllPeluquero")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los peluqueros"); //manejo de errores si la respuesta de la bd no es correcta
        return res.json();
      })
      .then((data) => {
        setPeluqueros(data.data || data); //devuelve un objeto { data: [...] } o un array directamente.
      })
      .catch((err) => setError(err.message)) //guarda el error
      .finally(() => setLoading(false)); //guarda el loading en false
  }, []);

  if (loading) return <p>Cargando peluqueros...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="container text-center my-4">
      <h2 className="mb-4">Peluqueros</h2>
      <div className="row justify-content-center">
        {peluqueros.map(
          (
            peluquero, //for de peluquero
          ) => (
            <motion.div
              key={peluquero.idPersona}
              className="col-6 col-md-3 mb-4 d-flex justify-content-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="d-flex flex-column align-items-center text-center">
                <motion.img
                  src={Foto3}
                  className="rounded-circle mb-2"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                />
                <h5 className="mt-2">{peluquero.nombre}</h5>
              </div>
            </motion.div>
          ),
        )}
      </div>
    </section>
  );
}

export default Estilista;
