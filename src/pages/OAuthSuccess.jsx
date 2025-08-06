/*import { useEffect } from 'react';
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

      const decoded = jwtDecode(token);
      setNombre(decoded.name || "");

      // Si quieres guardar el usuario completo:
      localStorage.setItem('usuario', JSON.stringify(decoded));

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

export default OAuthSuccess;*/
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storeAuth from '../context/storeAuth.jsx';
import { jwtDecode } from 'jwt-decode';
import useFetch from '../hooks/useFetch'; // ruta correcta según tu proyecto

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setToken, setNombre, setRol } = storeAuth();
  const { fetchDataBackend } = useFetch();

  useEffect(() => {
    const fetchOAuthData = async () => {
      try {
        // Puedes extraer el código o token temporal de la URL si es necesario
        const res = await fetchDataBackend(`${import.meta.env.VITE_BACKEND_URL}/auth/google/callback`, null, 'GET');

        const { token, usuario } = res;

        setToken(token);
        setNombre(usuario.nombre);
        setRol(usuario.rol);

        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario.rol === "admin") {
          navigate('/admin');
        } else {
          navigate('/paciente');
        }

      } catch (err) {
        console.error(err.message);
        navigate('/login');
      }
    };

    fetchOAuthData();
  }, [fetchDataBackend, setNombre, setRol, setToken, navigate]);

  return <p>Procesando inicio de sesión...</p>;
};

export default OAuthSuccess;
