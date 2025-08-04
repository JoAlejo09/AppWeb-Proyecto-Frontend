import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storeAuth from '../context/storeAuth.jsx';
import {jwtDecode} from 'jwt-decode';
import { set } from 'react-hook-form';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setToken, setNombre, setRol } = storeAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      const decoded = jwtDecode(token);
      setNombre(decoded.name || "");
      setRol(decoded.rol || "paciente"); // Asigna rol por defecto si no está presente      
      // Podrías decodificar el token con jwt-decode para extraer rol, nombre, etc.
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Procesando inicio de sesión...</p>;
};

export default OAuthSuccess;
