import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storeAuth from '../store/storeAuth';
import {jwtDecode} from 'jwt-decode'; 

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if(token){
        try{
          const decoded = jwtDecode(token);
          console.log(decoded)
           storeAuth({
            token,
            user: {
              nombre: decoded.nombre || "",
              email: decoded.email || "",
            },
          rol: decoded.rol || "paciente", // fallback a 'paciente'
        });
        
        navigate("/paciente")
        }catch(error){
          console.error("Error al decodificar el token:", error);
          navigate("/login");
        }
      }else{
        navigate("/login")
      }
  }, []);

  return <p>Procesando inicio de sesión...</p>;
};

export default OAuthSuccess;
