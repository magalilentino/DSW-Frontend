import { useState } from "react";
import "../styles/Reservas.css";
import Footer from "../components/general/Footer";
import Reservas from "../components/reserve/Reservas";
import type { ServicioItem } from "../components/home/Servicio.tsx";
import type { PeluqueroItem } from "../components/home/Peluqueros.tsx";
import Precio from "../components/reserve/Precio.tsx";

function Reserve() {
  const [step, setStep] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioItem | null>(null);
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState<PeluqueroItem | null>(null);

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
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
          <div className="row">
          <Reservas 
            onSelectServicio={setServicioSeleccionado}
            servicioSeleccionado={servicioSeleccionado}
            onSelectPeluquero={setPeluqueroSeleccionado}
            peluqueroSeleccionado={peluqueroSeleccionado}
            step={step}
          />

          <Precio 
            servicio={servicioSeleccionado} 
            peluquero={peluqueroSeleccionado}
            onNextStep={() => setStep(step + 1)}
            step={step}
          />
          </div>
        <button
          className="logout-button"
          onClick={() => {
            // Elimina datos del usuario
            localStorage.removeItem("token"); 
            localStorage.removeItem("type"); 
            localStorage.removeItem("nombre");  

            window.location.href = "/";
          }}
          >
          Cerrar sesión
        </button>

        </section>
      </main>
      <Footer />
    </>
  );
}

export default Reserve;


