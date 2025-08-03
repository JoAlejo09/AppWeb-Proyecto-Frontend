import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth.jsx";

const RutaProtegida = ({ children, rol }) => {
  const { token, rol: rolUsuario } = storeAuth(); // ✅ esta es la línea correcta

  if (!token || !rolUsuario) {
    return <Navigate to="/login" replace />;
  }

  if (rol && rolUsuario !== rol) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;
