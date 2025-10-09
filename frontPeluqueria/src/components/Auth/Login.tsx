import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onToggleMode: () => void;
}

interface LoginResponse {
  message: string;
  token: string;
  type: string;
  nombre: string;
  idPersona: number; 
}

function Login({ onToggleMode }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    if (token && type) {
      if (type === "cliente") navigate("/reserve");
      else if (type === "peluquero") navigate("/admin");
    }
  }, [navigate]);

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
        throw new Error(data?.message || `Error ${res.status}: No se pudo iniciar sesión`);
      }

      
      localStorage.setItem("token", data.token); //
      localStorage.setItem("type", data.type);
      localStorage.setItem("nombre", data.nombre); //
      localStorage.setItem("idPersona", String(data.idPersona)); 

      if (data.type === "cliente") {
        navigate("/reserve");
      } else if (data.type === "peluquero") {
        navigate("/admin");
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
        <div className="auth-remember-container">
          <label className="auth-remember-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Recuérdame
          </label>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="auth-button-usser mt-2"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
      <div className="auth-divider">
        <span>o</span>
      </div>
      <p className="pt-3">
        ¿No tiene cuenta aún?{" "}
        <span
          className="auth-register-link"
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

