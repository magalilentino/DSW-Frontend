import { useAuth } from "../../../components/general/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/perfil.css";
import { apiFetch } from "../../../shared/apiFetch.ts";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Estado para guardar los datos originales y comparar si hubo cambios, si lo deseas,
  // pero para mantenerlo simple y directo a la edición:
  const [formData, setFormData] = useState<Partial<Persona>>({});

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const dataPerfil = await apiFetch(`/persona/${user.idPersona}`);

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
    if (!user) return;
    try {
      const data = await apiFetch(
        `/persona/peluquero/${user.idPersona}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        },
      );

      setSuccess(data.message);
      setTimeout(() => setSuccess(""), 3000);

      // Opcional: recargar datos tras guardar
      // setFormData(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="perfil-container">Cargando formulario...</div>;
  if (error)
    return <div className="perfil-container text-danger">Error: {error}</div>;

  return (
    <div className="perfil-box-peluquero">
      <h2>Editar Mi Perfil</h2>

      {success && <div className="alert alert-success">{success}</div>}

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
            Guardar Cambios
          </button>
          <button
            className="auth-button-cancel"
            onClick={() => navigate("/admin")}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
