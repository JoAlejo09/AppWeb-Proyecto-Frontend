import { Navigate } from "react-router-dom";
import storeAuth from "./storeAuth.jsx";
import { useEffect, useState } from "react";

const RutaProtegida = ({ children, rol }) => {
  const { token, rol: rolUsuario } = storeAuth();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simula la carga de datos del store
    const timeout = setTimeout(() => {
      setCargando(false);
    }, 100); // Ajusta si necesitas más tiempo

    return () => clearTimeout(timeout);
  }, []);

  if (cargando) return <p>Cargando...</p>;

  if (!token || !rolUsuario) {
    return <Navigate to="/login" replace />;
  }

  if (rol && rolUsuario !== rol) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;
