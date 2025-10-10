import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Reserve from "./pages/Reserve.tsx";
import Admin from "./pages/Admin.tsx";
import Categoria from "./components/Admin/categoria/Categoria.tsx";
import CrearCategoria from "./components/Admin/categoria/CrearCategoria.tsx";
import ActualizarCategoria from "./components/Admin/categoria/ActualizarCategoria.tsx";
import Atencion from "./components/Admin/atencion/Atencion.tsx";
import AtencionServicio from "./components/Admin/atencion/ServiciosDeAtencion.tsx";
import Servicio from "./components/home/Servicio.tsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/Servicio" element={<Servicio />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/categoria/crear" element={<CrearCategoria />} />
        <Route path="/categoria/actualizar/:idCategoria" element={<ActualizarCategoria />}/>
        <Route path="/atencion" element={<Atencion/>}/>
        <Route path="/atencion/serviciosDeAtencion/:idAtencion" element={<AtencionServicio/>}/>
      </Routes>
    </Router>
  );
}

export default App;



