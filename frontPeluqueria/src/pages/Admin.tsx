import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import Footer from "../components/general/Footer.tsx";
import { Link } from "react-router-dom";


const sections = [
  { label: "Peluqueros", path: "/peluquero" },
  { label: "Servicio", path: "/servicio" },
  { label: "Fórmula", path: "/formula" },
  { label: "Tono", path: "/tono" },
  { label: "Producto", path: "/producto" },
  { label: "Marca", path: "/marca" },
  { label: "Categoría", path: "/categoria" },
  { label: "Atencion", path: "/atencion" },
  { label: "Perfil", path: "/perfil" },
];

const Admin: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");

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
          {sections.map((section) => (
            <a key={section.path} href={section.path} className="navbar-link">
              {section.label}
            </a>
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