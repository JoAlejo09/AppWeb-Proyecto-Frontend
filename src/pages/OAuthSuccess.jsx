import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storeAuth from '../context/storeAuth.jsx';
import { jwtDecode } from 'jwt-decode';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setToken, setNombre, setRol } = storeAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      const decoded = jwtDecode(token);
      const nombre = decoded.nombre || "Usuario";
      const rol = decoded.rol || "paciente";

      // Guardar en el store y localStorage
      setToken(token);
      setNombre(nombre);
      setRol(rol);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(decoded));

      // Redireccionar según rol
      if (rol === "admin") {
        navigate('/admin');
      } else {
        navigate('/paciente');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, setToken, setNombre, setRol]);

  return <p>Procesando inicio de sesión...</p>;
};

export default OAuthSuccess;
