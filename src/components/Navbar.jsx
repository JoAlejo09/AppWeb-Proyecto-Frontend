// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  }
   return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-700">
          MentalAPP
        </Link>
          {!usuario ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/registro"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Registrarse
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="text-purple-700 font-semibold">
                Bienvenido, {usuario.nombre || usuario.email}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
      </nav>
    </header>
  );
};

export default Navbar;