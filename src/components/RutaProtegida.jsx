import { Navigate } from "react-router-dom";
import storeAuth from "../store/storeAuth.jsx";

const RutaProtegida = ({ children, rol }) => {
  const { token, rol: rolUsuario } = storeAuth();

  // Si no hay token o no hay rol, redirige al login
  if (!token || !rolUsuario) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no coincide, redirige también
  if (rol && rolUsuario !== rol) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;
