import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const Cita = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [duracion, setDuracion] = useState(30);
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
        return;
      }

      const cantidad = duracion === 60 ? 3500 : 2000; // 60min cuesta más
      const token = localStorage.getItem("token"); // JWT

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pacientes/agendar`,
        {
          fecha,
          hora,
          motivo,
          duracion,
          cantidad,
          paymentMethodId: paymentMethod.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.msg || "Cita agendada con éxito");
      navigate("/mis-citas");
    } catch (err) {
      console.error(err);
      toast.error("Error al agendar la cita");
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
          <label>Duración (minutos):</label>
          <select
            className="w-full border rounded p-2"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
          >
            <option value={30}>30 minutos ($20)</option>
            <option value={60}>60 minutos ($35)</option>
          </select>
        </div>

        <div>
          <label>Datos de tarjeta:</label>
          <div className="border p-3 rounded">
            <CardElement />
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {cargando ? "Procesando..." : "Agendar y Pagar"}
        </button>
      </form>
    </div>
  );
};

export default Cita;
