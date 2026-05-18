import { createContext, useContext, useState } from "react"; // 🚨 Quitamos 'useEffect' de aquí
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthData {
  token: string;
  type: string;
  nombre: string;
  idPersona: number;
}

interface AuthContextType {
  user: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  // 🚨 CAMBIO CLAVE: Pasamos una función inicializadora al useState
  // Esto se ejecuta de forma síncrona en el "segundo cero", ganándole a las rutas protegidas.
  const [user, setUser] = useState<AuthData | null>(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    const nombre = localStorage.getItem("nombre");
    const idPersona = localStorage.getItem("idPersona");

    if (token && type && nombre && idPersona) {
      try {
        const decodedToken: any = jwtDecode(token);
        const tiempoActual = Date.now() / 1000; // Tiempo actual en segundos

        if (decodedToken.exp < tiempoActual) {
          console.warn("Sesión expirada detectada al cargar la página");
          localStorage.clear();
          return null; // El estado inicial será null
        } else {
          // ⭐ El token sigue siendo válido, devolvemos el objeto directamente
          // para que el estado inicial contenga al usuario desde el primer milisegundo
          return {
            token,
            type,
            nombre,
            idPersona: Number(idPersona),
          };
        }
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.clear();
        return null;
      }
    }
    return null; // Si no hay nada en el storage, arranca en null
  });

  // 🚨 EL useEffect QUE TENÍAS ACÁ SE ELIMINÓ POR COMPLETO

  const login = (data: AuthData) => {
    setUser(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("type", data.type);
    localStorage.setItem("nombre", data.nombre);
    localStorage.setItem("idPersona", String(data.idPersona));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Ocurrió un error al usar AuthContext");
  }
  return context;
}