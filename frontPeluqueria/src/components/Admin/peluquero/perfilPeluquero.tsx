import { useAuth } from "../../../components/general/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/perfil.css";

interface Persona {
  idPersona: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  type: "cliente" | "peluquero";
}


export default function PerfilPeluquero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
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
        `http://localhost:3000/api/persona/peluquero/${persona.idPersona}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

    const response = await res.json();
    if (!res.ok) throw new Error(response.message);

    setPersona(response.data);         
    setFormData(response.data);        
    setEditMode(false);
    setSuccess("Perfil actualizado correctamente");

    setTimeout(() => setSuccess(""), 3000); 
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
          <button className="auth-button-cancel" onClick={() => navigate("/admin")}>
            ⬅ Volver al Home
          </button>
        </div>
      </div>
    </div>
  );
}

  if (loading) return <div className="perfil-container">Cargando datos...</div>;
  if (error) return <div className="perfil-container text-danger">Error: {error}</div>;


  return (
        <div className="perfil-box-peluquero">
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
                  Editar perfil
                </button>
                <button
                  className="auth-button-cancel"
                  onClick={() => navigate("/admin")}
                >
                  ⬅ Volver al Home
                </button>
                <button
                className="logout-button"
                onClick={() => {
                  localStorage.removeItem("token"); 
                  localStorage.removeItem("type"); 
                  localStorage.removeItem("nombre"); 

                  window.location.href = "/";
                }}
                >
                Cerrar sesión
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
  );
}
