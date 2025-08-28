
interface RegisterProps {
  onToggleMode: () => void;
}

function Register({ onToggleMode }: RegisterProps) {
  return (
    <>
      <h2>Registrarse</h2>
      <form>
        <input type="text" name="dni" placeholder="DNI" required />
        <input type="password" name="clave" placeholder="Contraseña" required />
        <input type="text" name="nombre" placeholder="Nombre" required />
        <input type="text" name="apellido" placeholder="Apellido" required />
        <input type="tel" name="telefono" placeholder="Teléfono" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit" className="button-usser">
          Registrarse
        </button>
      </form>
      <p className="pt-3">
        ¿Ya tienes cuenta?{" "}
        <span
          className="register-link"
          onClick={onToggleMode}
          style={{ cursor: "pointer" }}
        >
          Iniciar sesión
        </span>
      </p>
    </>
  );
}

export default Register;
