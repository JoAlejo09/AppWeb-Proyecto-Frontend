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
import RutaProtegida from "./routes/RutaProtegida";
import PerfilAdmin from "./pages/admin/PerfilAdmin";
import Confirm from "./pages/Confirm";
import RedesSociales from "./pages/RedesSociales";
import OAuthSuccess from "./pages/OAuthSuccess";
import Chat from "./pages/Chat";
import Cita from "./pages/Cita"; 

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Carga tu clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Main />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/admin/activar/:token" element={<Active />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/nuevo-password/:token" element={<NuevoPassword />} />
        <Route path="/pacientes/confirmar/:token" element={<Confirm />} />
        <Route path="/redes-sociales" element={<RedesSociales />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/usuarios/chat" element={<Chat />} />
        <Route path="/cita" element={<Elements stripe={stripePromise}><Cita /></Elements>}/>    
        {/* Privadas - admin */}
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

        {/* Privada - paciente */}
        <Route
          path="/paciente"
          element={
            <RutaProtegida rol = "paciente">
              
              </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
