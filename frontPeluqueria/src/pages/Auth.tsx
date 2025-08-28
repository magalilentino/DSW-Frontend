import "..//styles/Auth.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const modeFromQuery = searchParams.get("mode");

  const [isRegistering, setIsRegistering] = useState(modeFromQuery === "register");

  useEffect(() => {
    setIsRegistering(modeFromQuery === "register");
  }, [modeFromQuery]);

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    navigate(`/auth?mode=${!isRegistering ? "register" : "login"}`, { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="left-side"></div>
      <div className="right-side">
        <div className="auth-box">
          <img src="/Logo.png" alt="Logo" className="login-logo" />
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
