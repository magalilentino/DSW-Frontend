import Foto1 from "../../assets/foto1.avif";
import Foto2 from "../../assets/foto2.avif";
import Foto3 from "../../assets/foto3.avif";

function Carrousel() {
  const servicios = [
    { foto: Foto1, titulo: "Corte de Cabello", descripcion: "Corte moderno y personalizado" },
    { foto: Foto2, titulo: "Barbería", descripcion: "Afeitado y arreglo de barba profesional" },
    { foto: Foto3, titulo: "Coloración", descripcion: "Tintes y mechas con productos de calidad" },
  ];

  return (
    <section className="container my-4">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>
      <div id="serviciosCarrusel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {servicios.map((servicio, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <div className="row justify-content-center align-items-center">
                <div className="col-12 col-md-5 mb-3 mb-md-0">
                  <img src={servicio.foto} className="d-block w-100 rounded-3 shadow-sm" alt={servicio.titulo} />
                </div>
                <div className="col-12 col-md-5">
                  <h5>{servicio.titulo}</h5>
                  <p>{servicio.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#serviciosCarrusel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
          <span className="visually-hidden">Anterior</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#serviciosCarrusel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </section>
  );
}

export default Carrousel;