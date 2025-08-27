import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define a type for the data returned by the API
interface LoginResponse {
  message: string;
  token: string;
  type: string;
}

export default function Login() {
  const [dni, setDni] = useState<string>("");
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
        body: JSON.stringify({ dni, clave }),
      });

      // Type the data from the API response
      const data: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error en login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("tipoUsuario", data.type);

      alert("Login exitoso como " + data.type);

      if (data.type === "cliente") {
        navigate("/cliente");
      } else if (data.type === "peluquero") {
        navigate("/peluquero");
      }
    } catch (err) {
      // Type the error for a safer catch block
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}