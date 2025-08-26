import "../styles/App.css"; // tus estilos de App 
import "../styles/index.css"; // estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Importar imágenes
import Logo from "../assets/Logo.png";
import Foto1 from "../assets/foto1.avif";
import Foto2 from "../assets/foto2.avif";
import Foto3 from "../assets/foto3.avif";

function App() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img className="logo" src={Logo} alt="Logo de la pagina web" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/contacto">Contacto</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/sobrenosotros">Sobre Nosotros</a>
                </li>
                <li className="nav-item">
                  <a className="boton-nav btn btn-light" href="/login">Iniciar sesión</a>
                </li>
                <li className="nav-item">
                  <a className="boton-nav btn btn-light" href="/register">Registrar</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Presentación */}
        <section className="presentacion">
          <div className="galeria">
            <div className="left">
              <img src={Foto1} alt="Corte 1" className="lightbox-img" />
            </div>
            <div className="right">
              <div className="foto">
                <img src={Foto2} alt="Corte 2" className="lightbox-img" />
              </div>
              <div className="foto">
                <img src={Foto3} alt="Corte 3" className="lightbox-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="servicios">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2>Servicios</h2>
              <div className="list-group">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5>Corte + Barba</h5>
                    <p className="mb-1">40 min</p>
                    <small>desde 15.000 ARS</small>
                  </div>
                  <button className="btn btn-reservar rounded-pill">Reservar</button>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5>Cabello largo</h5>
                    <p className="mb-1">1 h y 20 min</p>
                    <small>28.000 ARS</small>
                  </div>
                  <button className="btn btn-reservar rounded-pill">Reservar</button>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5>Corte de Barba</h5>
                    <p className="mb-1">20 min</p>
                    <small>10.000 ARS</small>
                  </div>
                  <button className="btn btn-reservar rounded-pill">Reservar</button>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5>Corte de cabello</h5>
                    <p className="mb-1">40 min</p>
                    <small>desde 12.000 ARS</small>
                  </div>
                  <button className="btn btn-reservar rounded-pill">Reservar</button>
                </div>
              </div>
              <button className="btn btn-todo mt-3">Ver todo</button>
            </div>

            <div className="col-lg-4">
              <div className="border p-3 rounded position-relative overflow-hidden">
                <div className="top-content">
                  <h2>Peluqueria</h2>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">valoración</span>
                    <span className="text-warning">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <span className="ms-2">(numero de reseñas)</span>
                  </div>
                  <span className="badge badge-outline-success mb-3">Ofertas</span>
                </div>
                <button className="btn w-100 mb-3" style={{backgroundColor: "#1f2937", color:"#f8f9fa"}}>
                  Reservar ahora
                </button>
                <p>
                  <i className="bi bi-clock"></i>
                  <span className="text-success">Abierto</span> desplegable con horarios
                </p>
                <p>
                  <i className="bi bi-geo-alt"></i> Calle 123, Rosario, Santa Fe
                  <a href="#" className="link-underline link-underline-opacity-0">Cómo llegar</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estilistas */}
        <section className="container text-center my-5">
          <h2>Estilistas</h2>
          <div className="row justify-content-center">
            {[1,2,3,4].map((i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="position-relative d-inline-block">
                  <img src={Foto3} className="rounded-cfrontPeluqueria/src/App.tsxircle img-fluid circulo" alt="Estilista" />
                  <span className="badge bg-white text-dark position-absolute bottom-0 start-50 translate-middle-x shadow-sm">5.0 ★</span>
                </div>
                <h5 className="mt-3">Estilista {i}</h5>
                <p className="text-muted">Estilista</p>
              </div>
            ))}
          </div>
        </section>

        {/* Servicios Carrusel */}
        <section className="container my-5">
          <h2 className="text-center mb-4">Nuestros Servicios</h2>
          <div id="serviciosCarrusel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {[Foto1, Foto2, Foto3].map((foto, i) => (
                <div key={i} className={`carousel-item ${i===0 ? "active" : ""}`}>
                  <div className="row justify-content-center align-items-center">
                    <div className="col-md-5">
                      <img src={foto} className="d-block w-100 rounded" alt={`Servicio ${i+1}`} />
                    </div>
                    <div className="col-md-5">
                      <h5>Servicio {i+1}</h5>
                      <p>Descripción del servicio {i+1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#serviciosCarrusel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#serviciosCarrusel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="container my-5">
          <h2 className="text-center mb-4">Recomendaciones</h2>
          <div className="row justify-content-center">
            {[1,2,3].map((i) => (
              <div key={i} className="col-md-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <p className="card-text">"Recomendación {i} del cliente"</p>
                    <div className="d-flex align-items-center mt-3">
                      <img src={Foto3} alt={`Cliente ${i}`} className="rounded-circle me-2" width={50} height={50} />
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
      </main>

      {/* Footer */}
      <footer className="bg-white text-dark pt-5 pb-4 border-top">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5>Peluquería</h5>
              <p>Ofrecemos cortes, peinados y tratamientos de alta calidad para que siempre luzcas genial.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Enlaces</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-dark text-decoration-none">Inicio</a></li>
                <li><a href="/sobrenosotros" className="text-dark text-decoration-none">Sobre Nosotros</a></li>
                <li><a href="/contacto" className="text-dark text-decoration-none">Contacto</a></li>
                <li><a href="/login" className="text-dark text-decoration-none">Iniciar Sesión</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Contacto</h5>
              <p><i className="bi bi-geo-alt-fill"></i> Calle 123, Rosario, Santa Fe</p>
              <p><i className="bi bi-telephone-fill"></i> +54 341 1234567</p>
              <p><i className="bi bi-envelope-fill"></i> info@peluqueria.com</p>
            </div>
          </div>
          <hr className="bg-dark" />
          <div className="text-center">&copy; 2025 Peluquería. Todos los derechos reservados.</div>
        </div>
      </footer>
    </>
  );
}

export default App;