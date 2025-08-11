import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nombre: "", rol: "" });
  const [openMenu, setOpenMenu] = useState(null); // Controla qué submenú está abierto

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    } else {
      navigate("/"); // redirige si no hay usuario logueado
    }
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div style={styles.container}>
      {/* Menú lateral */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>AdminPanel</h2>
        <nav style={styles.nav}>

          {/* Perfil */}
          <div>
            <div style={styles.link} onClick={() => toggleMenu("perfil")}>
              Perfil ▾
            </div>
            {openMenu === "perfil" && (
              <div style={styles.submenu}>
                <a style={styles.sublink} onClick={() => navigate("/admin/perfil")}>
                  Visualizar Perfil
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/cambiar-password")}>
                  Cambiar Contraseña
                </a>
              </div>
            )}
          </div>

          {/* Gestión de Pacientes */}
          <div>
            <div style={styles.link} onClick={() => toggleMenu("pacientes")}>
              Gestión de Pacientes ▾
            </div>
            {openMenu === "pacientes" && (
              <div style={styles.submenu}>
                <a style={styles.sublink} onClick={() => navigate("/admin/pacientes")}>
                  Listar Pacientes
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/paciente/visualizar")}>
                  Visualizar Paciente
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/paciente/baja")}>
                  Dar de Baja Paciente
                </a>
              </div>
            )}
          </div>

          {/* Recursos */}
          <div>
            <div style={styles.link} onClick={() => toggleMenu("recursos")}>
              Recursos ▾
            </div>
            {openMenu === "recursos" && (
              <div style={styles.submenu}>
                <a style={styles.sublink} onClick={() => navigate("/admin/recursos")}>
                  Visualizar Recursos
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/recursos/crear")}>
                  Crear Recurso
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/recursos/eliminar")}>
                  Eliminar Recurso
                </a>
              </div>
            )}
          </div>

          {/* Reportes */}
          <div>
            <div style={styles.link} onClick={() => toggleMenu("reportes")}>
              Reportes ▾
            </div>
            {openMenu === "reportes" && (
              <div style={styles.submenu}>
                <a style={styles.sublink} onClick={() => navigate("/admin/reportes")}>
                  Visualizar Reportes
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/reportes/crear")}>
                  Crear Reporte
                </a>
                <a style={styles.sublink} onClick={() => navigate("/admin/reportes/eliminar")}>
                  Eliminar Reporte
                </a>
              </div>
            )}
          </div>

          {/* Otros enlaces */}
          <a style={styles.link} onClick={() => navigate("/admin/chat")}>Chat</a>
          <a style={styles.link} onClick={() => navigate("/admin/citas")}>Citas</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main style={styles.main}>
        {/* Franja superior */}
        <div style={styles.userBar}>
          <span>👤 {usuario.nombre} — Rol: {usuario.rol}</span>
        </div>

        <section style={styles.content}>
          <h2>Bienvenido, {usuario.nombre}</h2>
          <p>Selecciona una opción del menú para comenzar.</p>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontSize: "1rem",
    cursor: "pointer",
    display: "block",
    padding: "8px 0",
  },
  submenu: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "15px",
    marginTop: "5px",
    gap: "5px",
  },
  sublink: {
    color: "#bdc3c7",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "none",
  },
  main: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: "0px",
  },
  userBar: {
    backgroundColor: "#ffffff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  content: {
    padding: "30px",
  },
};

export default DashboardAdmin;
