import {
  DIRECCION,
  TELEFONO,
  EMAIL,
  DESCRIPCION,
  GOOGLE_MAPS_LINK,
} from "../home/Constants";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Footer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <footer className="bg-white text-dark pt-5 pb-4 border-top">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-3 mb-4">
            <h5>Peluquería</h5>
            <p>{DESCRIPCION}</p>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Enlaces</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-dark text-decoration-none">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/info" className="text-dark text-decoration-none">
                  Sobre Nosotros & Contacto
                </a>
              </li>

              {user ? (
                <li>
                  <button
                    className="text-dark text-decoration-none btn btn-link p-0"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              ) : (
                <li>
                  <a
                    href="/auth?mode=login"
                    className="text-dark text-decoration-none"
                  >
                    Iniciar Sesión
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Contacto</h5>
            <p>
              <i className="bi bi-geo-alt-fill"></i>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark text-decoration-none ms-1"
              >
                {DIRECCION}
              </a>
            </p>
            <p>
              <i className="bi bi-telephone-fill"></i>{" "}
              <a
                href={`tel:${TELEFONO}`}
                className="text-dark text-decoration-none ms-1"
              >
                {TELEFONO}
              </a>
            </p>
            <p>
              <i className="bi bi-envelope-fill"></i>{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-dark text-decoration-none ms-1"
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </div>

        <hr className="bg-dark" />
        <div className="text-center">
          © 2025 Peluquería. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
