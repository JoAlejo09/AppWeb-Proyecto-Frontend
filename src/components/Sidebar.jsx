import { Link } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/admin/usuarios", label: "Usuarios" },
    { to: "/admin/recursos", label: "Recursos" },
    { to: "/admin/reportes", label: "Reportes" }
  ];

  return (
    <aside style={{ width: "220px", background: "#263238", color: "#fff", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px" }}>Admin</h2>
      <nav>
        {links.map(link => (
          <Link key={link.to} to={link.to} style={{ display: "block", margin: "15px 0", color: "#fff", textDecoration: "none" }}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
