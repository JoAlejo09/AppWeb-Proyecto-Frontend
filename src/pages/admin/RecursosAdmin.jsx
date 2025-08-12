import { useEffect, useState } from "react";
import axios from "axios";
import storeAuth from "../../context/storeAuth.jsx";
import { toast } from "react-toastify";
import EditarRecursoModal from "../../components/admin/EditarRecursoModal.jsx";

const RecursosAdmin = () => {
  const { token } = storeAuth();
  const [recursos, setRecursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [recursoEditar, setRecursoEditar] = useState(null);

  const BASE = `${import.meta.env.VITE_BACKEND_URL}/admin`;

  const cargarRecursos = async () => {
    try {
      const { data } = await axios.get(`${BASE}/recurso/lista`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecursos(data);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cargar los recursos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRecursos();
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este recurso?")) return;
    try {
      const { data } = await axios.delete(`${BASE}/recurso/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.msg || "Recurso eliminado");
      setRecursos(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Recursos</h1>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white shadow rounded border">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Título</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Descripción</th>
                <th className="text-left p-3">Creado</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recursos.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="p-3">{r.titulo}</td>
                  <td className="p-3 capitalize">{r.tipo}</td>
                  <td className="p-3">{r.descripcion}</td>
                  <td className="p-3">{new Date(r.fechaCreacion || r.createdAt).toLocaleString()}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setRecursoEditar(r)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(r._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {recursos.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No hay recursos creados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      {recursoEditar && (
        <EditarRecursoModal
          token={token}
          recurso={recursoEditar}
          onClose={() => setRecursoEditar(null)}
          onUpdated={cargarRecursos}
        />
      )}
    </div>
  );
};

export default RecursosAdmin;
