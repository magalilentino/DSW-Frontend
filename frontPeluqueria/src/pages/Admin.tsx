import { useEffect, useState } from "react";
import "../styles/Admin.css";
import Footer from "../components/general/Footer.tsx";
import { Link } from "react-router-dom";
import Foto3 from "../assets/foto3.avif";
import { useAuth } from "../components/general/AuthContext";

interface Persona {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  type: string;
}

const sections = [
  {
    label: "Registros",
    subsections: [
      { label: "Peluquero", path: "/peluquero/CrearPeluquero" },
      { label: "Marca", path: "/marca" },
      { label: "Categoria", path: "/categoria" },
      { label: "Servicio", path: "/servicios" },
      { label: "Fórmula", path: "/formula" },
      { label: "Tono", path: "/tono" },
      { label: "Producto", path: "/producto" },
    ],
  },
  { label: "Atenciones Pendientes", path: "/atencion" },
  { label: "Perfil", path: "/peluquero/perfilPeluquero" },
];

const Admin = () => {
  const { user } = useAuth();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pendientesHoy, setPendientesHoy] = useState<number>(0);
  const [completadasHoy, setCompletadasHoy] = useState<number>(0);
  const [gananciasHoy, setGananciasHoy] = useState<number>(0);

useEffect(() => {
  if (!user) return;

  const fetchGananciasHoy = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/atencion/ganancias-hoy", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setGananciasHoy(data.total);
    } catch (err) {
      console.error("Error al obtener ganancias del día:", err);
    }
  };

  fetchGananciasHoy();
}, [user]);



  useEffect(() => {
    if (!user) return;

    const fetchCompletadasHoy = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/atencion/completadas-hoy",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setCompletadasHoy(data.count);
      } catch (err) {
        console.error("Error al obtener atenciones completadas de hoy:", err);
      }
    };

    fetchCompletadasHoy();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchPendientesHoy = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/atencion/pendientes-hoy",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setPendientesHoy(data.count); // Solo usamos el número
      } catch (err) {
        console.error("Error al obtener atenciones pendientes de hoy:", err);
      }
    };

    fetchPendientesHoy();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/persona/${user.idPersona}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al obtener datos");
        setPersona(data);
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>Cargando perfil...</p>
    );
  }

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
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {section.path ? (
                <Link to={section.path} className="navbar-link">
                  {section.label}
                </Link>
              ) : (
                <span className="navbar-link navbar-dropdown-trigger">
                  {section.label} ▾
                </span>
              )}

              {section.subsections && hovered === i && (
                <div
                  className="custom-dropdown-menu"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
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

      <main className="admin-main">
        {/* Perfil */}
        <img
          src={Foto3}
          alt="Perfil"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "50%",
            margin: "30px",
          }}
        />
        <section className="profile-card">
          <h1>
            Bienvenido, {persona?.nombre} {persona?.apellido}
          </h1>
          <p>
            <strong>Dni:</strong> {persona?.dni}
          </p>
          <p>
            <strong>Email:</strong> {persona?.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {persona?.telefono}
          </p>
          <p>
            <strong>Tipo Usuario:</strong> {persona?.type}
          </p>
        </section>

        {/* Estadísticas */}
        <section className="stats-section">
          <h1>Estadísticas</h1>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>{pendientesHoy}</h3>
              <p>Atenciones Pendientes Hoy</p>
            </div>
            <div className="stat-card">
              <h3>{completadasHoy}</h3>
              <p>Atenciones Realizadas Hoy</p>
            </div>
            <div className="stat-card">
              <h3>$ {gananciasHoy}</h3>
              <p>Ganancias Totales Hoy</p>
            </div>
          </div>
        </section>

        {/* Próximos Turnos */}
        <section className="turnos-section">
          <h2>Próximos Turnos del Día</h2>
          <ul>
            <li>
              <strong>15:00</strong> | Cliente A | Corte
            </li>
            <li>
              <strong>16:30</strong> | Cliente B | Coloración
            </li>
            <li>
              <strong>17:00</strong> | Cliente C | Peinado
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
