import { useAuth } from "../components/general/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/perfil.css";

interface Persona {
  idPersona: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  type: "cliente" | "peluquero";
}

interface Servicio {
  codServicio: number;
  nombreServicio: string;
  descripcion?: string;
  cantTurnos?: number;
  precio?: number;
}

interface AtencionServicio {
  idAtSer: number;
  servicio?: Servicio; // puede ser undefined
}

interface Atencion {
  idAtencion: number;
  fecha: string;
  estado: "pendiente" | "finalizado" | "cancelado";
  atencionServicios?: AtencionServicio[]; // puede ser undefined
}

export default function MiPerfil() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [persona, setPersona] = useState<Persona | null>(null);
  const [historico, setHistorico] = useState<Atencion[]>([]);
  const [pendientes, setPendientes] = useState<Atencion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Persona>>({});

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Perfil
        const resPerfil = await fetch(
          `http://localhost:3000/api/persona/${user.idPersona}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const dataPerfil = await resPerfil.json();
        if (!resPerfil.ok) throw new Error(dataPerfil.message);
        setPersona(dataPerfil);
        setFormData(dataPerfil);

        // Histórico y pendientes
        const [resHist, resPend] = await Promise.all([
        fetch(`http://localhost:3000/api/atencion/historico/${user.idPersona}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`http://localhost:3000/api/atencion/pendientes/${user.idPersona}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

        const dataHist = await resHist.json();
        const dataPend = await resPend.json();

        if (!resHist.ok) throw new Error(dataHist.message);
        if (!resPend.ok) throw new Error(dataPend.message);

        setHistorico(dataHist);
        setPendientes(dataPend);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    
    };

    fetchData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user || !persona) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/persona/cliente/${persona.idPersona}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPersona(data);
      setEditMode(false);
      setSuccess("Perfil actualizado correctamente ✅");
    } catch (err: any) {
      setError(err.message);
    }
  };

if (!user) {
  return (
    <div className="perfil-container">
      <div className="perfil-box">
        <h2>Debes iniciar sesión para ver tu perfil.</h2>
        <div className="buttons-usser">
          <button className="auth-button-cancel" onClick={() => navigate("/")}>
            ⬅ Volver al Home
          </button>
        </div>
      </div>
    </div>
  );
}

  if (loading) return <div className="perfil-container">Cargando datos...</div>;
  if (error) return <div className="perfil-container text-danger">Error: {error}</div>;

  const renderServicios = (atencion: Atencion) => {
    const servicios = atencion.atencionServicios ?? [];
    if (servicios.length === 0) return <li>Sin servicios asociados</li>;
    return servicios.map(as => (
      <li key={as.idAtSer}>{as.servicio?.nombreServicio ?? "Servicio no disponible"}</li>
    ));
  };

  return (
    <div className="perfil-container">
      
      {/* Panel izquierdo con histórico y pendientes */}
        <div className="perfil-left-side">
        <div className="perfil-left-content">
            <h3>Histórico</h3>
            {historico.length === 0 ? (
              <p>No tienes atenciones pasadas.</p>
            ) : (
              <ul>
                {historico.map(a => (
                  <li key={a.idAtencion}>
                    <strong>Atencion para el {new Date(a.fecha).toLocaleDateString()}</strong>
                    <ul><strong>Servicios:</strong> {renderServicios(a)}</ul>
                  </li>
                ))}
              </ul>
            )}

            <h3>Pendientes</h3>
            {pendientes.length === 0 ? (
              <p>No tienes atenciones pendientes.</p>
            ) : (
              <ul>
                {pendientes.map(a => (
                  <li key={a.idAtencion}>
                    <strong>Atencion para el {new Date(a.fecha).toLocaleDateString()}</strong>
                    <ul><strong>Servicios:</strong> {renderServicios(a)}</ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      

      <div className="perfil-right-side">
        <div className="perfil-box">
          <h2>Mi Perfil</h2>
          {success && <div className="alert alert-success">{success}</div>}

          {persona && !editMode && (
            <div className="perfil-info">
              <p><strong>Nombre:</strong> {persona.nombre}</p>
              <p><strong>Apellido:</strong> {persona.apellido}</p>
              <p><strong>Email:</strong> {persona.email}</p>
              <p><strong>Teléfono:</strong> {persona.telefono}</p>
              <p><strong>DNI:</strong> {persona.dni}</p>
              <p><strong>Tipo:</strong> {persona.type}</p>
              <div className="buttons-usser">
                <button
                  className="auth-button-usser"
                  onClick={() => setEditMode(true)}
                >
                  Editar Perfil
                </button>
                <button
                  className="auth-button-cancel"
                  onClick={() => navigate("/")}
                >
                  ⬅ Volver al Home
                </button>
              </div>
            </div>
          )}

          {persona && editMode && (
            <div className="perfil-form">
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                placeholder="Nombre"
              />
              <input
                type="text"
                name="apellido"
                value={formData.apellido || ""}
                onChange={handleChange}
                placeholder="Apellido"
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="telefono"
                value={formData.telefono || ""}
                onChange={handleChange}
                placeholder="Teléfono"
              />
              <input
                type="text"
                name="dni"
                value={formData.dni || ""}
                onChange={handleChange}
                placeholder="DNI"
              />
              <div className="perfil-actions">
                <button className="auth-button-usser" onClick={handleSave}>
                  Guardar
                </button>
                <button
                  className="auth-button-cancel"
                  onClick={() => setEditMode(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
