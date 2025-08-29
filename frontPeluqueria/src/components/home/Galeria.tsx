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
        <section className="home-presentacion">
            <div className="home-galeria">
                <div className="home-left">
                    <img src={fotos[0].src} alt={fotos[0].alt} loading="lazy" />
                </div>
                <div className="home-right">
                {fotos.slice(1).map((foto, i) => (
                    <div key={i} className="foto">
                        <img src={foto.src} alt={foto.alt} loading="lazy" />
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}

export default Galeria;