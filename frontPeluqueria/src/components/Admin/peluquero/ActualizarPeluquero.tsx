import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Registros.css";

const ActualizarPeluquero: React.FC = () => {
  const { idPersona } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [dni, setDni]= useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/persona/${idPersona}`)
      .then((res) => res.json())
      .then((data) => {
        setNombre(data.data.nombre);
        setApellido(data.data.apellido);
        setClave(data.data.clave);
        setDni(data.data.dni);
        setEmail(data.data.email);
        setTelefono(data.data.telefono);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el peluquero");
        setLoading(false);
      });
  }, [idPersona]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/persona/${idPersona}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, clave, nombre, apellido, telefono, email, type:"peluquero" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el peluquero");
      }

      setSuccess("peluquero actualizado correctamente");
      setTimeout(() => navigate("/peluquero"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actualizar-container">
      <h2>Actualizar peluquero</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <form onSubmit={handleSubmit} className="actualizar-form">
          <input 
          type="text" 
          placeholder="DNI" 
          id= "dni"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required />
        <input 
          type="text" 
          placeholder="Nombre"
          id="nombre" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required />
        <input 
          type="text" 
          placeholder="Apellido" 
          id= "apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required />
        <input
          type="email"
          placeholder="Email"
          id= "emial"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="tel" 
          placeholder="Teléfono"
          id= "telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required />
        <input
          type="password"
          placeholder="Contraseña"
          id= "clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
          className="mt-2"
        />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ActualizarPeluquero;