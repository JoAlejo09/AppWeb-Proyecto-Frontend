import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storeAuth from '../context/storeAuth';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setToken } = storeAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      // Podrías decodificar el token con jwt-decode para extraer rol, nombre, etc.
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Procesando inicio de sesión...</p>;
};

export default OAuthSuccess;
