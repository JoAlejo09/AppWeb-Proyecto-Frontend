import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import Informacion from "./pages/Informacion";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import PacientesListar from "./pages/admin/PacientesListar";
import PacienteVer from "./pages/admin/PacienteVer";
import PacienteBaja from "./pages/admin/PacienteBaja";
import RecursosListar from "./pages/admin/RecursosListar";
import RecursosCrear from "./pages/admin/RecursosCrear";
import RecursosEliminar from "./pages/admin/RecursosEliminar";
import ReportesListar from "./pages/admin/ReportesListar";
import ReportesCrear from "./pages/admin/ReportesCrear";
import ReportesEliminar from "./pages/admin/ReportesEliminar";
import AdminHome from "./pages/admin/AdminHome";
import AdminLayout from "./layouts/AdminLayout";
import CitasAdmin from "./pages/admin/CitasAdmin";

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

      {/*Admin Layout */}
      <Route path="/admin" element={<RutaProtegida rol="admin"><AdminLayout /></RutaProtegida>}>
        <Route index element={<AdminHome />} />

        <Route path="perfil" element={<PerfilAdmin />} />
        <Route path="perfil/password" element={<PerfilAdmin />} />    
        {/* Pacientes */}
          <Route path="pacientes/listar" element={<PacientesListar />} />
          <Route path="pacientes/ver" element={<PacienteVer />} />
          <Route path="pacientes/baja" element={<PacienteBaja />} />

          {/* Recursos */}
          <Route path="recursos/listar" element={<RecursosListar />} />
          <Route path="recursos/crear" element={<RecursosCrear />} />
          <Route path="recursos/eliminar" element={<RecursosEliminar />} />

          {/* Reportes */}
          <Route path="reportes/listar" element={<ReportesListar />} />
          <Route path="reportes/crear" element={<ReportesCrear />} />
          <Route path="reportes/eliminar" element={<ReportesEliminar />} />

          {/* Chat, Citas dentro del panel */}
          <Route path="chat" element={<Chat />} />
          <Route
            path="citas"
            element={
              <Elements stripe={stripePromise}>
                <CitasAdmin />
              </Elements>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
