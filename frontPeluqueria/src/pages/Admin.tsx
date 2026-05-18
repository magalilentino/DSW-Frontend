import { useEffect, useState } from "react";
import "../styles/Admin.css";
import "../styles/Registros.css";
import Footer from "../components/general/Footer.tsx";
import { Link } from "react-router-dom";
import Foto3 from "../assets/foto3.avif";
import { useAuth } from "../components/general/AuthContext";
import { apiFetch } from "../shared/apiFetch.ts";

interface Persona {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  type: string;
}

interface Subsection {
  label: string;
  path?: string;
  isLogout?: boolean;
}

interface Section {
  label: string;
  path?: string;
  subsections?: Subsection[];
}

const sections: Section[] = [
  {
    label: "Registros",
    subsections: [
      { label: "Peluquero", path: "/peluquero/CrearPeluquero" },
      { label: "Marca", path: "/marca" },
      { label: "Categoria", path: "/categoria" },
      { label: "Servicio", path: "/servicios" },
      { label: "Tono", path: "/tono" },
      { label: "Producto", path: "/producto" },
      { label: "Descuentos", path: "/descuento" },
    ],
  },
  {
    label: "Agenda",
    subsections: [
      { label: "Bloquear día/horario", path: "/Calendario" },
      { label: "Atenciones Pendientes", path: "/atencion" },
    ],
  },
  {
    label: "Perfil",
    subsections: [
      { label: "Editar Perfil", path: "/peluquero/perfilPeluquero" },
      { label: "Cerrar sesión", isLogout: true },
    ],
  },
];

const Admin = () => {
  // 🚨 Traemos también 'logout' desde tu contexto
  const { user, logout } = useAuth(); 
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pendientesHoy, setPendientesHoy] = useState<number>(0);
  const [completadasHoy, setCompletadasHoy] = useState<number>(0);
  const [gananciasHoy, setGananciasHoy] = useState<number>(0);
  const [turnosHoy, setTurnosHoy] = useState<{ hora: string; cliente: string; servicios: string }[]>([]);
  const [servicios, setServicios] = useState<{ codServicio: number; nombreServicio: string }[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTurnosHoy = async () => {
      try {
        const url = servicioSeleccionado
          ? `/atencion/turnos-hoy?servicio=${servicioSeleccionado}`
          : "/atencion/turnos-hoy";

        const data = await apiFetch(url);
        setTurnosHoy(data);
      } catch (err) {
        setError("Error al obtener turnos del día:" + err);
      }
    };

    fetchTurnosHoy();
  }, [servicioSeleccionado]);

  useEffect(() => {
    const fetchDatosDashboard = async () => {
      setLoading(true);
      try {
        const [ganancias, completadas, pendientes, datosPerfil, listaServicios] = await Promise.all([
          apiFetch("/atencion/ganancias-hoy"),
          apiFetch("/atencion/completadas-hoy"),
          apiFetch("/atencion/pendientes-hoy"),
          apiFetch(`/persona/${user?.idPersona}`),
          apiFetch("/servicio/findAll")
        ]);

        setGananciasHoy(ganancias.total);
        setCompletadasHoy(completadas.count);
        setPendientesHoy(pendientes.count);
        setPersona(datosPerfil);
        setServicios(listaServicios.data || []);
      } catch (err: any) {
        setError("Error al cargar los datos del panel: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosDashboard();
  }, [user?.idPersona]);


  if (loading) {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>Cargando panel de administración...</p>
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
                  {section.subsections.map((sub, j) => {
                    if (sub.isLogout) {
                      return (
                        <button
                          key={j}
                          className="custom-dropdown-item logout-button"
                          style={{
                            width: "100%",
                            textAlign: "left",
                            border: "none",
                            background: "none",
                          }}
                          onClick={logout} // 🚨 Simplificado: Llama directo a la función de tu AuthContext
                        >
                          {sub.label}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={j}
                        to={sub.path!}
                        className="custom-dropdown-item"
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

      <main className="admin-main">
        {error && <p className="error">{error}</p>}
        
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
          <h1>Bienvenido, {persona?.nombre} {persona?.apellido}</h1>
          <p><strong>Dni:</strong> {persona?.dni}</p>
          <p><strong>Email:</strong> {persona?.email}</p>
          <p><strong>Teléfono:</strong> {persona?.telefono}</p>
          <p><strong>Tipo Usuario:</strong> {persona?.type}</p>
        </section>

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

        <section className="turnos-section">
          {/* Contenedor en forma de columna y centrado */}
          <div className="d-flex flex-column align-items-center mb-4">
            <h1 className="mb-2">Próximos Turnos del Día</h1>
            
            <select
              className="form-select text-center w-auto"
              value={servicioSeleccionado}
              onChange={(e) => setServicioSeleccionado(
                e.target.value === "" ? "" : Number(e.target.value)
              )}
            >
              <option value="">Todos</option>
              {servicios.map((s) => (
                <option key={s.codServicio} value={s.codServicio}>
                  {s.nombreServicio}
                </option>
              ))}
            </select>
          </div>
          
          {/* Resto de tu código... */}
          {turnosHoy.length === 0 ? (
            <p className="text-center">No hay turnos para hoy</p>
          ) : (
            <div className="turnos-grid">
              {turnosHoy.map((turno, i) => (
                <div key={i} className="turno-card">
                  <div className="turno-header">
                    <span className="turno-hora">{turno.hora}</span>
                  </div>
                  <div className="turno-body">
                    <p><strong>Cliente:</strong> {turno.cliente}</p>
                    <p><strong>Servicios:</strong> {turno.servicios}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;