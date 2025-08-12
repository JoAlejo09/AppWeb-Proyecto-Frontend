// src/layout/PacienteLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const PacienteLayout = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nombre: "", rol: "" });
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) {
      setUsuario(JSON.parse(u));
    } else {
      navigate("/login");
    }
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded text-sm ${
      isActive ? "bg-teal-600 text-white" : "text-gray-200 hover:bg-teal-500 hover:text-white"
    }`;

  const subLinkClass = ({ isActive }) =>
    `block pl-6 py-2 text-sm ${
      isActive ? "text-white" : "text-gray-300 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 p-4">
        <h2 className="text-xl font-bold mb-6">Paciente</h2>

        {/* PERFIL */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("perfil")}
            className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            Perfil ▾
          </button>
          {openMenu === "perfil" && (
            <div className="mt-1">
              <NavLink to="/paciente/perfil" className={subLinkClass}>
                Ver / Editar Perfil
              </NavLink>
              <NavLink to="/paciente/perfil/password" className={subLinkClass}>
                Cambiar Contraseña
              </NavLink>
            </div>
          )}
        </div>

        {/* RECURSOS */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("recursos")}
            className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            Recursos ▾
          </button>
          {openMenu === "recursos" && (
            <div className="mt-1">
              <NavLink to="/paciente/recursos/usar" className={subLinkClass}>
                Utilizar Recursos
              </NavLink>
              <NavLink to="/paciente/recursos/utilizados" className={subLinkClass}>
                Recursos Utilizados
              </NavLink>
            </div>
          )}
        </div>

        {/* Citas */}
        <NavLink to="/paciente/citas" className={linkClass}>
          Citas
        </NavLink>

        {/* Chat */}
        <NavLink to="/paciente/chat" className={linkClass}>
          Chat
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main / contenido */}
      <main className="flex-1 bg-gray-100">
        {/* Barra superior */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Panel del Paciente</h1>
            <p className="text-gray-500 text-sm">
              👤 {usuario.nombre} — Rol: {usuario.rol}
            </p>
          </div>
        </div>

        {/* Aquí se monta la vista seleccionada */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PacienteLayout;
