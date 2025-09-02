import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Reserve from "./pages/Reserve.tsx";
import Admin from "./pages/Admin.tsx";
import Categoria from "./components/Admin/Categoria.tsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/categoria" element={<Categoria />} />
      </Routes>
    </Router>
  );
}

export default App;