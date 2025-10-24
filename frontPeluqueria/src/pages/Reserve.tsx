import { useEffect, useState } from "react";
import "../styles/Reservas.css";
import Footer from "../components/general/Footer.tsx";
import Reservas from "../components/reserve/Reservas.tsx"; 
import Precio from "../components/reserve/Precio.tsx";
import type { ServicioItem } from "../components/home/Servicio.tsx";
import type { PeluqueroItem } from "../components/home/Peluqueros.tsx"; 

function Reserve() {
  const [step, setStep] = useState(1);
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioItem[]>([]);
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState<PeluqueroItem | null>(null);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState<{ inicio: string; fin: string }[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");
  const [minPrecio, setMinPrecio] = useState<number | null>(null);
  const [maxPrecio, setMaxPrecio] = useState<number | null>(null);
  const [serviciosFiltrados, setServiciosFiltrados] = useState<ServicioItem[]>([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/servicio/findAll");
        if (!res.ok) throw new Error("Error al cargar servicios");
        const data = await res.json();
        setServicios(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServicios();
  }, []);

  return (
    <>
      <main>
        <section className="reservas-servicio my-4">
          
          <button
            className="reservas-back-button"
            onClick={() => {
              if (step === 1) {
                window.location.href = "/";
              } else {
                setStep(step - 1);
                if (step === 2) {
                  setServiciosSeleccionados([]);
                } else if (step === 3) {
                  setPeluqueroSeleccionado(null);
                  setBloquesSeleccionados([]);
                }
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
         
          <div className="filtro-precio mb-4 mt-3">
            <h5>Filtrar servicios por precio</h5>
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <input
                type="number"
                placeholder="Precio mínimo"
                value={minPrecio ?? ""}
                onChange={(e) => setMinPrecio(e.target.value ? parseInt(e.target.value) : null)}
                className="form-control"
                style={{ maxWidth: "150px" }}
              />
              <input
                type="number"
                placeholder="Precio máximo"
                value={maxPrecio ?? ""}
                onChange={(e) => setMaxPrecio(e.target.value ? parseInt(e.target.value) : null)}
                className="form-control"
                style={{ maxWidth: "150px" }}
              />
              <button
                className="btn btn-success"
                onClick={async () => {
                  try {
                    const query = `?min=${minPrecio ?? 0}&max=${maxPrecio ?? Number.MAX_SAFE_INTEGER}`;
                    const res = await fetch(`http://localhost:3000/api/servicio/listarPorPrecio${query}`);
                    const data = await res.json();
                    if (res.ok && Array.isArray(data)) {
                      setServiciosFiltrados(data);
                    } else {
                      setServiciosFiltrados([]);
                      console.error("Respuesta inesperada del servidor:", data);
                    }
                  } catch (err) {
                    console.error("Error al filtrar servicios:", err);
                  }
                }}
              >
                Filtrar
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setMinPrecio(null);
                  setMaxPrecio(null);
                  setServiciosFiltrados([]);
                }}
              >
                Limpiar filtros
              </button>
            </div>

            
            {serviciosFiltrados.length > 0 && (
              <p className="mt-2 text-muted">
                Mostrando {serviciosFiltrados.length} servicio{serviciosFiltrados.length > 1 ? "s" : ""} filtrado{serviciosFiltrados.length > 1 ? "s" : ""}.
              </p>
            )}

            
            {serviciosFiltrados.length === 0 && minPrecio !== null && maxPrecio !== null && (
              <p className="mt-2 text-danger">
                No se encontraron servicios en ese rango de precio.
              </p>
            )}
          </div>

          
          <div className="row">
            <Reservas
              step={step}
              setStep={setStep}
              onNextStep={() => setStep(step + 1)}
              servicios={serviciosFiltrados.length > 0 ? serviciosFiltrados : servicios} 
              serviciosSeleccionados={serviciosSeleccionados}
              setServiciosSeleccionados={setServiciosSeleccionados}
              peluqueroSeleccionado={peluqueroSeleccionado}
              setPeluqueroSeleccionado={setPeluqueroSeleccionado}
              bloquesSeleccionados={bloquesSeleccionados}
              setBloquesSeleccionados={setBloquesSeleccionados}
              diaSeleccionado={diaSeleccionado}
              setDiaSeleccionado={setDiaSeleccionado}
            />
            <Precio
              peluquero={peluqueroSeleccionado}
              bloquesSeleccionados={bloquesSeleccionados}
              onNextStep={() => setStep(prev => prev + 1)} 
              step={step}
              serviciosSeleccionados={serviciosSeleccionados}
              setServiciosSeleccionados={setServiciosSeleccionados}
              diaSeleccionado={diaSeleccionado}
              setStep={setStep}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Reserve;