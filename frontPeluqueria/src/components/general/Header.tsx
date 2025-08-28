import { Link } from "react-router-dom";
function Header(){
  return(
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img className="logo" src="/Logo.png" alt="Logo de la pagina web" />
          </Link>
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
                  <Link className="nav-link" to="/contacto">Contacto</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sobrenosotros">Sobre Nosotros</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link boton-nav btn btn-light" to="/auth?mode=login">Iniciar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="boton-nav btn btn-light" to="/auth?mode=register">Registrar</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      );
      }

    export default Header;