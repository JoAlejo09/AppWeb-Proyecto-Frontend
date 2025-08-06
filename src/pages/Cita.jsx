/*import { useEffect, useState } from "react"
import TableSessions from "../components/sessions/Table"
import ModalSessions from "../components/sessions/Modal"
import { useParams } from "react-router"
import useFetch from "../hooks/useFetch"
import storeAuth from "../context/storeAuth"
import storeSessions from "../context/storeTreatments"
import { ToastContainer } from 'react-toastify'

const Details = () => {
    const { id } = useParams()
    const [student, setStudent] = useState({})
    const [sessions, setSessions] = useState([])
    const { fetchDataBackend } = useFetch()
    const { rol } = storeAuth()
    const { modal, toggleModal } = storeSessions()

    const getStudentDetails = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/${id}`
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.state.token}`
        }

        const response = await fetchDataBackend(url, null, "GET", headers)
        setStudent(response)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-EC', { dateStyle: 'long', timeZone: 'UTC' })
    }

    useEffect(() => {
        getStudentDetails()
    }, [])

    return (
        <>
            <ToastContainer />
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Visualizar estudiante</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
                <p className='mb-8'>Este módulo te permite visualizar toda la información del estudiante y sus sesiones psicológicas.</p>
            </div>

            <div className='m-5 flex justify-between'>

                <div>
                    <ul className="list-disc pl-5">

                        {/* Datos personales del estudiante }
                        <li className="text-md text-gray-00 mt-4 font-bold text-xl">Datos personales</li>
                        <ul className="pl-5">
                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Cédula: {student?.cedula}</span>
                            </li>

                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Nombre completo: {student?.nombre}</span>
                            </li>

                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Correo institucional: {student?.email}</span>
                            </li>

                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Teléfono: {student?.celular}</span>
                            </li>
                        </ul>

                        {/* Datos académicos }
                        <li className="text-md text-gray-00 mt-4 font-bold text-xl">Información académica</li>
                        <ul className="pl-5">
                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Carrera: {student?.carrera}</span>
                            </li>

                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Nivel: {student?.nivel}</span>
                            </li>

                            <li className="text-md text-gray-00 mt-2">
                                <span className="text-gray-600 font-bold">Fecha de nacimiento: {formatDate(student?.fechaNacimiento)}</span>
                            </li>

                            <li className="text-md text-gray-00 mt-4">
                                <span className="text-gray-600 font-bold">Motivo de consulta: {student?.motivoConsulta}</span>
                            </li>
                        </ul>
                    </ul>
                </div>

                <div>
                    <img src={student?.avatar || student?.avatarIA} alt="avatar" className='h-80 w-80 rounded-full object-cover' />
                </div>
            </div>

            <hr className='my-4 border-t-2 border-gray-300' />

            <div className='flex justify-between items-center'>

                <p>Este módulo te permite gestionar las sesiones psicológicas del estudiante.</p>
                {
                    rol === "psicologo" && (
                        <button
                            className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
                            onClick={() => { toggleModal("sessions") }}
                        >
                            Registrar sesión
                        </button>
                    )
                }

                {modal === "sessions" && (<ModalSessions studentID={student._id} />)}
            </div>

            {
                sessions.length === 0
                    ?
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">No existen registros de sesiones</span>
                    </div>
                    :
                    <TableSessions sessions={sessions} />
            }
        </>
    )
}

export default Details
*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const Cita = () => {
const [fecha, setFecha] = useState("");
const [hora, setHora] = useState("");
const [motivo, setMotivo] = useState("");
const [duracion, setDuracion] = useState(30); // en minutos
const [cargando, setCargando] = useState(false);

const stripe = useStripe();
const elements = useElements();
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
if (!stripe || !elements) {
  return toast.error("Stripe aún no está cargado");
}

try {
  setCargando(true);
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: "card",
    card: elements.getElement(CardElement),
  });

  if (error) {
    toast.error(error.message);
    setCargando(false);
    return;
  }

  // Supongamos que el costo de una cita es 20 USD
  const cantidad = 2000; // en centavos
  const response = await axios.post("/pacientes/agendar", {
    fecha,
    hora,
    motivo,
    duracion,
    cantidad,
    paymentMethodId: paymentMethod.id,
  });

  toast.success(response.data.msg || "Cita agendada con éxito");
  navigate("/mis-citas");
} catch (err) {
  console.log(err);
  toast.error("Error al agendar cita");
} finally {
  setCargando(false);
}
};

return (
<div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow rounded-xl">
<h2 className="text-2xl font-bold mb-4">Agendar Cita</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label>Fecha:</label>
<input
type="date"
className="w-full border rounded p-2"
value={fecha}
onChange={(e) => setFecha(e.target.value)}
required
/>
</div>
<div>
<label>Hora:</label>
<input
type="time"
className="w-full border rounded p-2"
value={hora}
onChange={(e) => setHora(e.target.value)}
required
/>
</div>
<div>
<label>Motivo:</label>
<textarea
className="w-full border rounded p-2"
value={motivo}
onChange={(e) => setMotivo(e.target.value)}
required
/>
</div>
<div>
<label>Duración (min):</label>
<select
className="w-full border rounded p-2"
value={duracion}
onChange={(e) => setDuracion(e.target.value)}
>
<option value={30}>30 minutos</option>
<option value={60}>60 minutos</option>
</select>
</div>

php-template
Copiar
Editar
    <div>
      <label>Datos de tarjeta:</label>
      <div className="border p-3 rounded">
        <CardElement />
      </div>
    </div>

    <button
      type="submit"
      disabled={cargando}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {cargando ? "Procesando..." : "Agendar y Pagar"}
    </button>
  </form>
</div>
);
};

export default Cita;