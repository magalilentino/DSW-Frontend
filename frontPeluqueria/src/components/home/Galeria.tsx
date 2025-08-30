import { useState } from "react";
import { motion, AnimatePresence} from "motion/react"

import Foto1 from "../../assets/foto1.avif";
import Foto2 from "../../assets/foto2.avif";
import Foto3 from "../../assets/foto3.avif";

const fotos = [
  { src: Foto1, alt: "Corte 1" },
  { src: Foto2, alt: "Corte 2" },
  { src: Foto3, alt: "Corte 3" },
];

function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);

  const nextFoto = () => {
    if (selected !== null) setSelected((selected + 1) % fotos.length);
  };

  const prevFoto = () => {
    if (selected !== null)
      setSelected((selected - 1 + fotos.length) % fotos.length);
  };

  return (
    <section className="home-presentacion">
      <div className="home-galeria">
        <div className="home-left">
          <img
            src={fotos[0].src}
            alt={fotos[0].alt}
            loading="lazy"
            onClick={() => setSelected(0)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="home-right">
          {fotos.slice(1).map((foto, i) => (
            <div key={i} className="foto">
              <img
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                onClick={() => setSelected(i + 1)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      </div>


      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prevFoto(); }}
              style={{
                position: "absolute",
                left: "20px",
                color: "white",
                fontSize: "2rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              ‹
            </button>

            <motion.img
              key={fotos[selected].src}
              src={fotos[selected].src}
              alt={fotos[selected].alt}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "10px" }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); nextFoto(); }}
              style={{
                position: "absolute",
                right: "20px",
                color: "white",
                fontSize: "2rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Galeria;



