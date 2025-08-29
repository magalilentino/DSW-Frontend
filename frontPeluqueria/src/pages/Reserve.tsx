import "../styles/Reserve.css";
import Footer from "../components/general/Footer";
import  Reservas from  "../components/reserve/Reservas";
import Precio from "../components/reserve/Precio.tsx"

function Reserve() {
  return (
    <>
      <main>
        <section className="servicios my-4">
          <button className="back-button" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div className="row">
            <Reservas />
            <Precio />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Reserve;
