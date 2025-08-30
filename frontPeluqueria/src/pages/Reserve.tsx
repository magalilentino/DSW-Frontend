import { useState } from "react"; // <-- falta esta línea
import "../styles/Reservas.css";
import Footer from "../components/general/Footer";
import Reservas from "../components/reserve/Reservas";
import type { ServicioItem } from "../components/reserve/Reservas";
import Precio from "../components/reserve/Precio.tsx";

function Reserve() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioItem | null>(null);

  return (
    <>
      <main>
        <section className="reservas-servicio my-4">
          <button className="back-button" onClick={() => window.location.href = "/"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div className="row">
            <Reservas 
              onSelectServicio={setServicioSeleccionado}
              servicioSeleccionado={servicioSeleccionado}
            />
            <Precio servicio={servicioSeleccionado} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Reserve;