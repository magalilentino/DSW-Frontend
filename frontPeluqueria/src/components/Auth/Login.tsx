import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onToggleMode: () => void;
}

interface LoginResponse {
  message: string;
  token: string;
  type: string;
}

function Login({ onToggleMode }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:3000/api/persona/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, clave }),
    });

    const data: LoginResponse = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error en login");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("tipoUsuario", data.type);


    if (data.type === "cliente") {
      navigate("/reserve");
    } else if (data.type === "peluquero") {
      navigate("/turnos");
    }
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Ocurrió un error desconocido.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
          className="mt-2"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="button-usser mt-2"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
      <div className="divider">
        <span>o</span>
      </div>
      {/* 
      <button className="button-guest">Reservar como invitado</button>
      */}
      <p className="pt-3">
        ¿No tiene cuenta aún?{" "}
        <span
          className="register-link"
          onClick={onToggleMode}
          style={{ cursor: "pointer" }}
        >
          Registrate Aquí
        </span>
      </p>
    </>
  );
}

export default Login;
