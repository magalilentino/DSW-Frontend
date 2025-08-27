// login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dni = document.getElementById("dni").value;
  const clave = document.getElementById("clave").value;
  const mensaje = document.getElementById("mensaje");

  try {
    const res = await fetch("http://localhost:3000/api/persona/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni, clave }),
    });

    const data = await res.json();

    if (res.ok) {
      // Guardar token y tipoUsuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipoUsuario", data.type);

    //   mensaje.style.color = "green";
    //   mensaje.textContent = "Login exitoso ✅";

      // Redirigir según el tipo de usuario
      if (data.type === "cliente") {
        window.location.href = "cliente.html";
      } else if (data.type === "peluquero") {
        window.location.href = "peluquero.html";
      }
    } else {
      mensaje.style.color = "red";
      mensaje.textContent = data.message;
    }
  } catch (err) {
    mensaje.style.color = "red";
    mensaje.textContent = "Error de conexión con el servidor";
  }
});
