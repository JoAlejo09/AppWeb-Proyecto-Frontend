import { useEffect, useState } from 'react';
import axios from 'axios';
import storeAuth from '../../context/storeAuth.jsx';
import { toast } from 'react-toastify';

const CitasAdmin = () => {
  const { token } = storeAuth();
  const [citas, setCitas] = useState([]);

  const cargar = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/citas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCitas(data);
    } catch (e) {
      toast.error("Error al cargar citas");
    }
  };

  useEffect(() => { if (token) cargar(); }, [token]);

  const marcarCumplida = async (id) => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/citas/${id}/cumplida`,{},{
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data.msg);
      cargar();
    } catch (e) {
      toast.error("No se pudo marcar como cumplida");
    }
  };

  const marcarPagadaEfectivo = async (id) => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/citas/${id}/pagada-efectivo`,{},{
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data.msg);
      cargar();
    } catch (e) {
      toast.error("No se pudo marcar como pagada");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Citas</h1>

      <div className="overflow-auto bg-white border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Paciente</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Motivo</th>
              <th className="p-2">Pago</th>
              <th className="p-2">Estado Cita</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(c => (
              <tr key={c._id} className="border-t">
                <td className="p-2">{c.nombrePaciente} <br/><small>{c.emailPaciente}</small></td>
                <td className="p-2">{new Date(c.fecha).toLocaleString()}</td>
                <td className="p-2">{c.motivo}</td>
                <td className="p-2">
                  {c.metodoPago} - {c.estadoPago}
                </td>
                <td className="p-2">{c.estadoCita}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => marcarCumplida(c._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Cumplida
                  </button>
                  {c.metodoPago === 'Efectivo' && c.estadoPago !== 'Pagado' && (
                    <button
                      onClick={() => marcarPagadaEfectivo(c._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Marcar Pagada
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {citas.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  No hay citas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CitasAdmin;
