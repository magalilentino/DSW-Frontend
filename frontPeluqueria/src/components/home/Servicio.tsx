interface ServicioItem {
  nombre: string;
  duracion: string;
  precio: string;
}

const servicios: ServicioItem[] = [
  { nombre: "Corte + Barba", duracion: "40 min", precio: "desde 15.000 ARS" },
  { nombre: "Cabello largo", duracion: "1 h y 20 min", precio: "28.000 ARS" },
  { nombre: "Corte de Barba", duracion: "20 min", precio: "10.000 ARS" },
  { nombre: "Corte de cabello", duracion: "40 min", precio: "desde 12.000 ARS" },
];

function Servicio(){
    return (
        <section className="servicios my-4">
          <div className="row">
            <div className="col-lg-8">
              <h2>Servicios</h2>
              <ul className="list-group">
                {servicios.map((s, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5>{s.nombre}</h5>
                      <p className="mb-1">{s.duracion}</p>
                      <small>{s.precio}</small>
                    </div>
                    <button className="btn btn-reservar rounded-pill">Reservar</button>
                  </li>
                ))}
              </ul>
              <button className="btn btn-todo mt-3">Ver todo</button>
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
                  <span className="badge badge-outline-success text-success mb-3">Ofertas</span>
                </div>
               <button className="btn btn-reservar-general w-100 mb-3 text-light bg-dark">
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