import { useEffect, useState } from "react";
import "../styles/Reservas.css";
import Footer from "../components/general/Footer.tsx";
import Reservas from "../components/reserve/Reservas.tsx";
import Precio from "../components/reserve/Precio.tsx";
import type { ServicioItem } from "../components/home/Servicio.tsx";
import type { PeluqueroItem } from "../components/home/Peluqueros.tsx";
import { apiFetch } from "../shared/apiFetch.ts";

function Reserve() {
  const [step, setStep] = useState(1);
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
    ServicioItem[]
  >([]);
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] =
    useState<PeluqueroItem | null>(null);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState<
    { inicio: string; fin: string }[]
  >([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("");

useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await apiFetch("/servicio/findAll");
        setServicios(data.data || []);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
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

          <div className="row">
            <Reservas
              step={step}
              setStep={setStep}
              onNextStep={() => setStep(step + 1)}
              servicios={servicios}
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
              onNextStep={() => setStep((prev) => prev + 1)}
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
