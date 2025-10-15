import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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
  const [user, setUser] = useState<AuthData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    const nombre = localStorage.getItem("nombre");
    const idPersona = localStorage.getItem("idPersona");

    if (token && type && nombre && idPersona) {
      setUser({
        token,
        type,
        nombre,
        idPersona: Number(idPersona),
      });
    }
  }, []);

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
    throw new Error("ocurrio un error");
  }
  return context;
}