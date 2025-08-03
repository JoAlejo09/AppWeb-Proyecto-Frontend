import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nombre: "", rol: "" });

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    } else {
      navigate("/"); // redirige si no hay usuario logueado
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Menú lateral */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>AdminPanel</h2>
        <nav style={styles.nav}>
          <a style={styles.link} href="#">Inicio</a>
          <a style={styles.link} href="#">Gestión de Pacientes</a>
          <a style={styles.link} href="#">Recursos</a>
          <a style={styles.link} href="#">Cuestionarios</a>
          <a style={styles.link} href="#">Alertas</a>
          <a style={styles.link} href="#">Reportes</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main style={styles.main}>
        {/* Franja superior */}
        <div style={styles.userBar}>
          <span>👤 {usuario.nombre} — Rol: {usuario.rol}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>Cerrar sesión</button>
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
  logoutButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  content: {
    padding: "30px",
  },
};

export default DashboardAdmin;
