import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const AdminLayout = () => {
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
      isActive ? "bg-indigo-600 text-white" : "text-gray-200 hover:bg-indigo-500 hover:text-white"
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
        <h2 className="text-xl font-bold mb-6">AdminPanel</h2>

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
              <NavLink to="/admin/perfil" className={subLinkClass}>
                Visualizar Perfil
              </NavLink>
              <NavLink to="/admin/perfil/password" className={subLinkClass}>
                Cambiar Contraseña
              </NavLink>
            </div>
          )}
        </div>

        {/* PACIENTES */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("pacientes")}
            className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            Gestión de Pacientes ▾
          </button>
          {openMenu === "pacientes" && (
            <div className="mt-1">
              <NavLink to="/admin/pacientes" className={subLinkClass}>
                Lista de Pacientes
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
              <NavLink to="/admin/recursos/listar" className={subLinkClass}>
                Gestón de Recursos
              </NavLink>
              <NavLink to="/admin/recursos/crear" className={subLinkClass}>
                Crear
              </NavLink>
              <NavLink to="/admin/recursos/eliminar" className={subLinkClass}>
                Eliminar
              </NavLink>
            </div>
          )}
        </div>

        {/* REPORTES */}
        <div className="mb-2">
          <button
            onClick={() => toggleMenu("reportes")}
            className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            Reportes ▾
          </button>
          {openMenu === "reportes" && (
            <div className="mt-1">
              <NavLink to="/admin/reportes/listar" className={subLinkClass}>
                Visualizar
              </NavLink>
              <NavLink to="/admin/reportes/crear" className={subLinkClass}>
                Crear
              </NavLink>
              <NavLink to="/admin/reportes/eliminar" className={subLinkClass}>
                Eliminar
              </NavLink>
            </div>
          )}
        </div>

        {/* Chat y Citas */}
        <NavLink to="/admin/chat" className={linkClass}>
          Chat
        </NavLink>
        <NavLink to="/admin/citas" className={linkClass}>
          Citas
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
        {/* Top bar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Panel de Administración</h1>
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

export default AdminLayout;
