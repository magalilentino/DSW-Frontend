function Footer() {
  return (
      <footer className="bg-white text-dark pt-5 pb-4 border-top">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5>Peluquería</h5>
              <p>Ofrecemos cortes, peinados y tratamientos de alta calidad para que siempre luzcas genial.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Enlaces</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-dark text-decoration-none">Inicio</a></li>
                <li><a href="/sobrenosotros" className="text-dark text-decoration-none">Sobre Nosotros</a></li>
                <li><a href="/contacto" className="text-dark text-decoration-none">Contacto</a></li>
                <li><a href="/login" className="text-dark text-decoration-none">Iniciar Sesión</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Contacto</h5>
              <p><i className="bi bi-geo-alt-fill"></i> Calle 123, Rosario, Santa Fe</p>
              <p><i className="bi bi-telephone-fill"></i> +54 341 1234567</p>
              <p><i className="bi bi-envelope-fill"></i> info@peluqueria.com</p>
            </div>
          </div>
          <hr className="bg-dark" />
          <div className="text-center">&copy; 2025 Peluquería. Todos los derechos reservados.</div>
        </div>
      </footer>
  );
}

export default Footer;

