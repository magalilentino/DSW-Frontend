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
import ModificarAtSer from "./components/Admin/atencion/modificarAtSer.tsx";
import Servicio from "./components/home/Servicio.tsx";
import MiPerfil from "./pages/Perfil.tsx";
import NosotrosContacto from "./pages/NosotrosContacto";
import Marca from "./components/Admin/marca/Marca.tsx";
import CrearMarca from "./components/Admin/marca/CrearMarca.tsx";
import ActualizarMarca from "./components/Admin/marca/ActualizarMarca.tsx";
import Producto from "./components/Admin/producto/Producto.tsx";
import CrearPeluquero from "./components/Admin/peluquero/CrearPeluquero.tsx";
import Formula from "./components/Admin/formula/Formula.tsx";
import CrearFormula from "./components/Admin/formula/CrearFormula.tsx";
import ActualizarFormula from "./components/Admin/formula/ActualizarFormula.tsx";





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
        <Route path="/atencion/modificarAtSer/:idAtSer" element={<ModificarAtSer/>}/>
        <Route path="/perfil" element={<MiPerfil/>} />
        <Route path="/info" element={<NosotrosContacto />} />
        <Route path="/marca" element= {<Marca/>}/>
        <Route path="/marca/crear" element= {<CrearMarca/>}/>
        <Route path="/marca/actualizar/:idMarca" element= {<ActualizarMarca/>}/>
        <Route path="/producto" element= {<Producto/>}/>
        <Route path="/peluquero/CrearPeluquero" element= {<CrearPeluquero/>}/>
        <Route path="/formula" element={<Formula />} />
        <Route path="/formula/crear" element={<CrearFormula />} />
        <Route path="/formula/actualizar/:idFormula" element={<ActualizarFormula />} />
      </Routes>
    </Router>
  );
}

export default App;



