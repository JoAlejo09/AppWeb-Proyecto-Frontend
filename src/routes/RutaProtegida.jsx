import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth.jsx";

const RutaProtegida = ({ children, rol }) => {
  const token = storeAuth(state => state.token);
  const rolUsuario = storeAuth(state => state.rol);

  // No autenticado
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero rol incorrecto
  if (rolUsuario !== rol) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado y con rol correcto
  return children;
};

export default RutaProtegida;
