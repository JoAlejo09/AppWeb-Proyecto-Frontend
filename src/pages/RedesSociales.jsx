// src/pages/RedesSociales.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeAuth from "../store/StoreAuth.jsx"; // asegúrate que la ruta es correcta

const RedesSociales = () => {
  const navigate = useNavigate();
  const setToken = storeAuth((state) => state.setToken);
  const setUsuario = storeAuth((state) => state.setUsuario);
  const setRol = storeAuth((state) => state.setRol);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const usuario = params.get("usuario");
    const rol = params.get("rol");

    if (token && usuario && rol) {
      setToken(token);
      setUsuario(JSON.parse(decodeURIComponent(usuario)));
      setRol(rol);

      if (rol === "admin") {
        navigate("/admin/perfil");
      } else {
        navigate("/paciente");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return <div className="text-center mt-10">Iniciando sesión...</div>;
};

export default RedesSociales;
