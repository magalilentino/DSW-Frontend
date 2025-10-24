import "../styles/Auth.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const modeFromQuery = searchParams.get("mode");

  const [isRegistering, setIsRegistering] = useState(modeFromQuery === "register"); //indica que forma se muestra (login o register)

  useEffect(() => {
    setIsRegistering(modeFromQuery === "register");
  }, [modeFromQuery]);

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    navigate(`/auth?mode=${!isRegistering ? "register" : "login"}`, { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-left-side"></div>
      <div className="auth-right-side">
        <div className="auth-box">
          <Link to="/">
            <img src="/Logo.png" alt="Logo" className="auth-login-logo"/>
          </Link>
          {isRegistering ? (
            <Register onToggleMode={toggleMode} />
          ) : (
            <Login onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
