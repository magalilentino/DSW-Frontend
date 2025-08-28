import Foto3 from "../../assets/foto3.avif";

function Estilista() {
  const estilistas = [
    { nombre: "Ana", rol: "Corte y peinado", rating: 5 },
    { nombre: "Luis", rol: "Barbería", rating: 4.9 },
    { nombre: "Marta", rol: "Coloración", rating: 5 },
    { nombre: "Juan", rol: "Corte clásico", rating: 4.8 },
  ];

  return (
    <section className="container text-center my-4">
      <h2 className="mb-4">Estilistas</h2>
      <div className="row justify-content-center">
        {estilistas.map((estilista, index) => (
          <div key={index} className="col-6 col-md-3 mb-4">
            <div className="position-relative d-inline-block">
              <img
                src={Foto3}
                className="rounded-circle img-fluid"
                alt={estilista.nombre}
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <span
                className="badge bg-white text-dark position-absolute bottom-0 start-50 translate-middle-x shadow-sm"
                aria-label={`Rating: ${estilista.rating} estrellas`}
              >
                {estilista.rating} ★
              </span>
            </div>
            <h5 className="mt-3">{estilista.nombre}</h5>
            <p className="text-muted">{estilista.rol}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Estilista;
