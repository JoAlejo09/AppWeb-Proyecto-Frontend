import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth.jsx";

const RutaProtegida = ({ children, rol }) => {
  const { token, rol: rolUsuario } = storeAuth();

  if (!token || rolUsuario !== rol) {
    return null;
    }
  if(rolUsuario!==rol){
        return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;