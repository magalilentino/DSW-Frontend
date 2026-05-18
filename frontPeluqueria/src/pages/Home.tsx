import "../styles/Home.css";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import Galeria from "../components/home/Galeria";
import Servicio from "../components/home/Servicio";
import Estilista from "../components/home/Peluqueros";
import Carrousel from "../components/home/Carrousel";
import Recomendacion from "../components/home/Recomendacion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/general/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.type === "peluquero") {
          navigate("/admin");
        }
  }, [user, navigate]);

  return (
    <>
      <Header />
      <main>
        <Galeria />
        <Servicio />
        <Estilista />
        <Carrousel />
        <Recomendacion />
      </main>
      <Footer />
    </>
  );
}

export default Home;