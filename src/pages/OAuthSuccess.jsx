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
      setToken(token);
      localStorage.setItem('token', token);

//      const decoded = jwtDecode(token);
 //     setNombre(decoded.name || "");

      // Si quieres guardar el usuario completo:
//      localStorage.setItem('usuario', JSON.stringify(decoded));

      // Redirige según el rol
      if (decoded.rol === "admin") {
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