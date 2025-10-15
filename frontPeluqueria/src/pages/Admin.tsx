import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import Footer from "../components/general/Footer.tsx";
import { Link } from "react-router-dom";


const sections = [
  { 
    label: "Registros",
    subsections: [
      { label: "Peluquero", path: "/peluquero/CrearPeluquero" },
      { label: "Marca", path: "/marca" },
      { label: "Categoria", path: "/categoria" },
      { label: "Servicio", path: "/servicio" },
      { label: "Fórmula", path: "/formula" },
      { label: "Tono", path: "/tono" },
      { label: "Producto", path: "/producto" },
    ]},
  { label: "Atenciones Pendientes", path: "/atencion" },
  { label: "Perfil", path: "/perfil" },
];



const Admin: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    if (storedNombre) {
      setNombre(storedNombre);
     }// else {
    //   window.location.href = "/auth";
    // }
  }, []);


  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="navbar-left">
          <Link className="navbar-brand" to="/">
            <img className="logo" src="/Logo.png" alt="Logo de la pagina web" />
          </Link>
        </div>
        <nav className="navbar-links">
          {sections.map((section, i) => (
            <div
              key={i}
              className="navbar-item-container"
              onMouseEnter={() => setHovered(i) }
              onMouseLeave={() => setHovered(null)}
            >
              {/* Sección principal */}
              {section.path ? (
                <Link to={section.path} className="navbar-link">
                  {section.label}
                </Link>
              ) : (
                <span className="navbar-link navbar-dropdown-trigger">
                  {section.label} ▾
                </span>
              )}

              {/* Submenú desplegable */}
              {section.subsections && hovered === i && (
                <div className="custom-dropdown-menu"
                  onMouseEnter={() => setHovered(i)}     // evita cierre cuando entras al menú
                  onMouseLeave={() => setHovered(null)} // cierra al salir del menú
                >
                  {section.subsections.map((sub, j) => (
                    <Link
                      key={j}
                      to={sub.path}
                      className="custom-dropdown-item"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

      <main className="main-content">
        <section className="section">
          <h2>Bienvenido, {nombre}</h2>    
        </section>
          <button
          className="logout-button"
          onClick={() => {
            // Elimina datos del usuario
            localStorage.removeItem("token"); 
            localStorage.removeItem("type"); 
            localStorage.removeItem("nombre"); 

            window.location.href = "/";
          }}
          >
          Cerrar sesión
        </button>
      </main>
    
        <Footer />
    </div>
    
    // le agregaria una imagen en el fondo para q no quede tan vacio
  );
};

export default Admin;