import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import storeAuth from "../../context/storeAuth.jsx";
import { FiEye, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const PacientesListar = () => {
  const { token } = storeAuth();

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  // Control de modales
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idParaBaja, setIdParaBaja] = useState(null);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/admin/pacientes`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPacientes(data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al obtener pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPacientes();
  }, [token]);

  // Filtrado por nombre/apellido/email
  const pacientesFiltrados = useMemo(() => {
    const term = filtro.toLowerCase().trim();
    if (!term) return pacientes;
    return pacientes.filter((p) => {
      const nombre = (p.nombre || "").toLowerCase();
      const apellido = (p.apellido || "").toLowerCase();
      const email = (p.email || "").toLowerCase();
      return nombre.includes(term) || apellido.includes(term) || email.includes(term);
    });
  }, [filtro, pacientes]);

  // Abrir modal ver
  const handleVer = (paciente) => {
    setSelectedPaciente(paciente);
    setOpenView(true);
  };

  // Abrir modal edición
  const handleEditar = (paciente) => {
    setSelectedPaciente(paciente);
    setOpenEdit(true);
  };

  const confirmarBaja = (id) => {
    setIdParaBaja(id);
    setOpenConfirm(true);
  };

  const darDeBaja = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/admin/pacientes/baja/${idParaBaja}`;
      const { data } = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data?.msg || "Paciente dado de baja");
      setOpenConfirm(false);
      setIdParaBaja(null);
      fetchPacientes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al dar de baja");
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado y filtro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email"
            className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-1 focus:ring-purple-600"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="py-3 px-3 text-left">Nombre</th>
              <th className="py-3 px-3 text-left">Apellido</th>
              <th className="py-3 px-3 text-left">Email</th>
              <th className="py-3 px-3 text-left">Teléfono</th>
              <th className="py-3 px-3 text-left">Estado</th>
              <th className="py-3 px-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  Cargando pacientes...
                </td>
              </tr>
            ) : pacientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No hay pacientes que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              pacientesFiltrados.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="py-3 px-3">{p.nombre}</td>
                  <td className="py-3 px-3">{p.apellido}</td>
                  <td className="py-3 px-3">{p.email}</td>
                  <td className="py-3 px-3">{p.telefono || "-"}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        p.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center px-2 py-1 text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                        onClick={() => handleVer(p)}
                        title="Ver"
                      >
                        <FiEye className="mr-1" /> Ver
                      </button>
                      <button
                        className="inline-flex items-center px-2 py-1 text-amber-700 bg-amber-100 rounded hover:bg-amber-200"
                        onClick={() => handleEditar(p)}
                        title="Editar"
                      >
                        <FiEdit2 className="mr-1" /> Editar
                      </button>
                      <button
                        className="inline-flex items-center px-2 py-1 text-red-700 bg-red-100 rounded hover:bg-red-200"
                        onClick={() => confirmarBaja(p._id)}
                        title="Dar de baja"
                      >
                        <FiTrash2 className="mr-1" /> Baja
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal VER */}
      <Modal
        open={openView}
        onClose={() => setOpenView(false)}
        title="Detalles del Paciente"
      >
        {selectedPaciente ? (
          <div className="space-y-2 text-sm">
            <p><strong>Nombre:</strong> {selectedPaciente.nombre}</p>
            <p><strong>Apellido:</strong> {selectedPaciente.apellido}</p>
            <p><strong>Email:</strong> {selectedPaciente.email}</p>
            <p><strong>Teléfono:</strong> {selectedPaciente.telefono || "-"}</p>
            <p><strong>Rol:</strong> {selectedPaciente.rol}</p>
            <p><strong>Estado:</strong> {selectedPaciente.activo ? "Activo" : "Inactivo"}</p>
            <p><strong>Registrado:</strong> {new Date(selectedPaciente.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-gray-500">No hay datos para mostrar.</p>
        )}
        <div className="mt-5 text-right">
          <button
            onClick={() => setOpenView(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* Modal EDITAR */}
      <EditarPacienteModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        paciente={selectedPaciente}
        onSaved={() => {
          setOpenEdit(false);
          fetchPacientes();
        }}
      />

      {/* Confirmar Baja */}
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Confirmar baja"
      >
        <p className="text-sm text-gray-700">
          ¿Está seguro que desea dar de baja a este paciente?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setOpenConfirm(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={darDeBaja}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Dar de baja
          </button>
        </div>
      </Modal>
    </div>
  );
};

/** Modal de edición */
const EditarPacienteModal = ({ open, onClose, paciente, onSaved }) => {
  const { token } = storeAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      activo: true,
    }
  });

  useEffect(() => {
    if (paciente) {
      reset({
        nombre: paciente.nombre || "",
        apellido: paciente.apellido || "",
        telefono: paciente.telefono || "",
        activo: paciente.activo ?? true,
      });
    }
  }, [paciente, reset]);

  const onSubmit = async (formData) => {
    if (!paciente?._id) return;
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/admin/pacientes/${paciente._id}`;
      const { data } = await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data?.msg || "Paciente actualizado");
      onSaved?.();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al actualizar paciente");
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Editar Paciente">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
          {errors.nombre && <p className="text-red-600 text-xs">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="text-sm block mb-1 font-semibold">Apellido</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            {...register("apellido", {
              required: "El apellido es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
          {errors.apellido && <p className="text-red-600 text-xs">{errors.apellido.message}</p>}
        </div>

        <div>
          <label className="text-sm block mb-1 font-semibold">Teléfono</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            {...register("telefono")}
          />
        </div>

        <div className="flex items-center gap-2">
          <input id="activo" type="checkbox" {...register("activo")} />
          <label htmlFor="activo" className="text-sm">Activo</label>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PacientesListar;
