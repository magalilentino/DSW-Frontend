import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Header() {
  const { user, logout } = useAuth();
  
//define a dónde lleva el botón "Mi Perfil"
  let profileLink = "/"; 
  if (user) {
    if (user.type === 'peluquero') {
      profileLink = "/admin";
    } else if (user.type === 'cliente') {
      profileLink = "/perfil"; 
    }
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img className="logo" src="/Logo.png" alt="Logo de la pagina web" />
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* If si es usuario */}
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={profileLink}>Mi Perfil</Link> 
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" onClick={logout}>Cerrar sesión</button>
                  </li>
                </>
              ) : (
                <>
                  {/* Else */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/NosotrosContacto">Contacto</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/NosotrosContacto">Sobre Nosotros</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth?mode=login">Iniciar sesión</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth?mode=register">Registrar</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

