import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../../styles/Admin.css";

interface RegisterResponse {
  message: string;
}

export default function CrearPeluquero() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/persona/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni,
          clave,
          nombre,
          apellido,
          telefono,
          email,
          type: "peluquero",
        }),
      });

      const data: RegisterResponse = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en el registro");

      setSuccess("Registro exitoso");
      setTimeout(() => navigate("/perfil"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="contenedor-pagina">
    // <div className="crear-container">
    //   <button
    //       className="reservas-back-button"
    //       onClick={() => {window.location.href = "/admin";}}>
    //       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    //           <path d="M15 18l-6-6 6-6" />
    //       </svg>
    //   </button>
    // <><h2>Registrar un nuevo peluquero</h2><form onSubmit={handleSubmit} className="crear-form">
    //   <input
    //     type="text"
    //     placeholder="DNI"
    //     value={dni}
    //     onChange={(e) => setDni(e.target.value)}
    //     required />
    //   <input
    //     type="text"
    //     placeholder="Nombre"
    //     value={nombre}
    //     onChange={(e) => setNombre(e.target.value)}
    //     required />
    //   <input
    //     type="text"
    //     placeholder="Apellido"
    //     value={apellido}
    //     onChange={(e) => setApellido(e.target.value)}
    //     required />
    //   <input
    //     type="email"
    //     placeholder="Email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     required />
    //   <input
    //     type="tel"
    //     placeholder="Teléfono"
    //     value={telefono}
    //     onChange={(e) => setTelefono(e.target.value)}
    //     required />
    //   <input
    //     type="password"
    //     placeholder="Contraseña"
    //     value={clave}
    //     onChange={(e) => setClave(e.target.value)}
    //     required
    //     className="mt-2" />

    //   {error && <p className="error">{error}</p>}
    //   {success && <p className="success">{success}</p>}

    //   <button
    //     type="submit"
    //     className="auth-button-usser"
    //     disabled={loading}
    <div className="admin-servicio my-4 container-fluid">
      <motion.div
        className="card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Registrar Peluquero</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
            Volver
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {success && <p className="text-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              type="text"
              className="form-control"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Peluquero"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
