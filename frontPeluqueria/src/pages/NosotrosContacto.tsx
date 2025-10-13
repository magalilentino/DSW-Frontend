import "../styles/nosotrosContacto.css";
import { DIRECCION, TELEFONO, EMAIL, GOOGLE_MAPS_LINK } from "../components/home/Constants.tsx";
import { useNavigate } from "react-router-dom";


function SobreNosotrosContacto() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="sobre-nosotros">
        <h2>Sobre Nosotros</h2>
        <div className="nosotros-contenido">
          <div className="nosotros-imagen">
            <img src="/Logo.png" alt="Logo de la peluquería" />
          </div>
          <div className="nosotros-texto">
            <p>
              En <strong>Peluquería Estilo & Belleza</strong>, nos apasiona ayudarte a resaltar tu estilo personal. 
              Con más de una década de experiencia, ofrecemos cortes, coloraciones, tratamientos capilares y asesoramiento personalizado.
            </p>
            <p>
              Nuestro equipo de profesionales se capacita constantemente para brindarte las últimas tendencias y técnicas. 
              Creemos que cada visita debe ser una experiencia relajante, renovadora y única.
            </p>
            <p>
              Valoramos la confianza que nuestros clientes depositan en nosotros y trabajamos cada día para superarnos. 
              ¡Gracias por elegirnos!
            </p>
          </div>
        </div>
      </div>

      <div className="horarios">
        <h3>Horarios de Atención</h3>
        <ul>
          <li>Lunes a Viernes: 9:00 – 20:00</li>
          <li>Sábados: 9:00 – 18:00</li>
          <li>Domingos: Cerrado</li>
        </ul>
      </div>

      <div className="contacto">
        <h2>Contacto</h2>
        <ul>
          <li>
            <i className="bi bi-geo-alt-fill"></i>
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer">
              {DIRECCION}
            </a>
          </li>
          <li>
            <i className="bi bi-telephone-fill"></i>
            <a href={`tel:${TELEFONO}`}>{TELEFONO}</a>
          </li>
          <li>
            <i className="bi bi-envelope-fill"></i>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </li>
        </ul>
        <p className="contacto-mensaje">
          ¿Tenés dudas, sugerencias o querés reservar un turno? ¡Estamos para ayudarte!
        </p>

        <div className="mapa">
          <iframe
            src= {GOOGLE_MAPS_LINK}
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Ubicación de la peluquería"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default SobreNosotrosContacto;



