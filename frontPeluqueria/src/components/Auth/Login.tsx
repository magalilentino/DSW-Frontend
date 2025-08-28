
interface LoginProps {
  onToggleMode: () => void;
}

function Login({ onToggleMode }: LoginProps) {
  return (
    <>
      <h2>Iniciar Sesión</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <button type="submit" className="button-usser">
          Entrar
        </button>
      </form>
      <div className="divider">
        <span>o</span>
      </div>
      {/* comentario 
      <button className="button-guest">Reservar como invitado</button>*/}
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
