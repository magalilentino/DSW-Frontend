import "../styles/Home.css";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";
import Galeria from "../components/home/Galeria";
import Servicio from "../components/home/Servicio";
import Estilista from "../components/home/Estilista";
import Carrousel from "../components/home/Carrousel";
import Recomendacion from "../components/home/Recomendacion";


function Home() {
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