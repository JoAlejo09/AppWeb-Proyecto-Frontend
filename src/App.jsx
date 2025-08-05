// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import Informacion from "./pages/Informacion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAdmin from "./pages/DashboardAdmin";
import Active from "./pages/Active";
import Recuperar from "./pages/Recuperar";
import NuevoPassword from "./pages/NuevoPassword";
import RutaProtegida from "./components/RutaProtegida";
import PerfilAdmin from "./pages/admin/PerfilAdmin";
import Confirm from "./pages/Confirm";
import RedesSociales from "./pages/RedesSociales";
import OAuthSuccess from "./pages/OAuthSuccess";
import Chat from "./pages/Chat";
import Details from "./pages/Details";

function App() {
  return (
    <Router>
      <Navbar /> {/* Menú visible en todas las páginas */}
      <Routes>
        {/* Páginas Públicas */}
        <Route path="/" element={<Main />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/admin/activar/:token" element={<Active />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/nuevo-password/:token" element={<NuevoPassword />} />
        <Route path="/pacientes/confirmar/:token" element={<Confirm/>}/>
        <Route path="/redes-sociales" element={<RedesSociales />} />
        <Route path="/oauth-success" element={<OAuthSuccess/>}/>
        <Route path="/usuarios/chat" element={<Chat />} />
        <Route path="agendar/citas" element={<Details/>}/>
        


        {/* Páginas Privadas (solo admins autenticados) */}
        
        <Route
          path="/admin"
          element={
            <RutaProtegida rol="admin">
              <DashboardAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <RutaProtegida rol="admin">
              <PerfilAdmin />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
