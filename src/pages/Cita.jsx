import React, { useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import storeAuth from "../context/storeAuth.jsx"; // si usas Zustand para token

const Cita = () => {
  const { token } = storeAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [metodoPago, setMetodoPago] = useState("Stripe"); // Stripe | Efectivo
  const [cargando, setCargando] = useState(false);

  const onAgendar = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);

      const base = import.meta.env.VITE_BACKEND_URL;
      const headers = { Authorization: `Bearer ${token}` };

      if (metodoPago === "Stripe") {
        if (!stripe || !elements) {
          toast.error("Stripe no está listo");
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast.error("No se encontró el CardElement");
          return;
        }

        // Crear paymentMethod
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        // Agendar y pagar
        const { data } = await axios.post(
          `${base}/pacientes/cita/agendar-pagar`,
          {
            fecha,
            hora,
            motivo,
            duracion,
            paymentMethodId: paymentMethod.id,
          },
          { headers }
        );

        toast.success(data.msg || "Cita agendada y pagada");
      } else {
        // Efectivo
        const { data } = await axios.post(
          `${base}/pacientes/cita/agendar-efectivo`,
          { fecha, hora, motivo, duracion },
          { headers }
        );

        toast.success(data.msg || "Cita agendada (pago en efectivo pendiente)");
      }

      // Opcional: limpiar
      setFecha("");
      setHora("");
      setMotivo("");
      setDuracion(30);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error al agendar cita");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Agendar Cita</h2>
      <form onSubmit={onAgendar} className="space-y-4">

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
            onChange={(e) => setDuracion(Number(e.target.value))}
          >
            <option value={30}>30 minutos ($20)</option>
            <option value={60}>60 minutos ($35)</option>
          </select>
        </div>

        <div>
          <label>Método de pago</label>
          <select
            className="w-full border rounded p-2"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="Stripe">Tarjeta (Stripe)</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>

        {metodoPago === "Stripe" && (
          <div>
            <label>Tarjeta:</label>
            <div className="border p-3 rounded">
              <CardElement />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Usa tarjetas de prueba de Stripe, ejemplo: 4242 4242 4242 4242
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {cargando ? "Procesando..." : metodoPago === "Stripe" ? "Agendar y Pagar" : "Agendar (Efectivo)"}
        </button>
      </form>
    </div>
  );
};

export default Cita;
