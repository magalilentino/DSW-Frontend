import Foto3 from "../../assets/foto3.avif";
//recomendaciones
function Recomendacion() {
  const recomendaciones = [1, 2, 3];

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Recomendaciones</h2>
      <div className="row">
        {recomendaciones.map((i) => (
          <div key={i} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column">
                <p>"Recomendación {i} del cliente"</p>
                <div className="d-flex align-items-center mt-3">
                  <img
                    src={Foto3}
                    alt={`Cliente ${i}`}
                    className="rounded-circle me-2"
                    width={50}
                    height={50}
                  />
                  <div>
                    <h6 className="mb-0">Cliente {i}</h6>
                    <small className="text-muted">5.0 ★</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Recomendacion;
