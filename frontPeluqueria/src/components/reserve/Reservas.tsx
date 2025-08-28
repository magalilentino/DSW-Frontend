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

function Reservas(){
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
        </div>
        </section>);
}

export default Reservas;