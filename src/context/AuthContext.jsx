import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [usuario, setUsuario] = useState(null); // null = no autenticado
const [cargando, setCargando] = useState(true);

useEffect(() => {
// Aquí puedes cargar el usuario desde localStorage o hacer una consulta al backend
const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
if (usuarioGuardado) {
setUsuario(usuarioGuardado);
}
setCargando(false);
}, []);

const login = (datos) => {
setUsuario(datos);
localStorage.setItem("usuario", JSON.stringify(datos));
};

const logout = () => {
setUsuario(null);
localStorage.removeItem("usuario");
localStorage.removeItem("rol")
localStorage.removeItem("token")
};

return (
<AuthContext.Provider value={{ usuario, cargando, login, logout }}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);