import Foto1 from "../../assets/foto1.avif";
import Foto2 from "../../assets/foto2.avif";
import Foto3 from "../../assets/foto3.avif";

const fotos = [
  { src: Foto1, alt: "Corte 1" },
  { src: Foto2, alt: "Corte 2" },
  { src: Foto3, alt: "Corte 3" },
];

function Galeria(){
    return (
        <section className="presentacion">
            <div className="galeria">
                <div className="left">
                    <img src={fotos[0].src} alt={fotos[0].alt} className="lightbox-img" loading="lazy" />
                </div>
                <div className="right">
                {fotos.slice(1).map((foto, i) => (
                    <div key={i} className="foto">
                        <img src={foto.src} alt={foto.alt} className="lightbox-img" loading="lazy" />
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}

export default Galeria;