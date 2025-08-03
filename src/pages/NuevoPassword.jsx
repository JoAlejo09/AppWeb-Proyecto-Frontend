import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NuevoPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/nuevopassword/${token}`;
      const response = await axios.post(url, {
        password: data.password,
        confirmpassword: data.confirmpassword
      });

      toast.success(response.data.msg, {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/"), 3000); // Redirige al login
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al actualizar la contraseña", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Nueva Contraseña</h2>
        <p style={styles.subtitle}>Ingresa y confirma tu nueva contraseña</p>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            })}
            style={styles.input}
          />
          {errors.password && <span style={styles.error}>{errors.password.message}</span>}

          <input
            type="password"
            placeholder="Confirmar contraseña"
            {...register("confirmpassword", {
              required: "Debes confirmar la contraseña",
              validate: value => value === watch("password") || "Las contraseñas no coinciden"
            })}
            style={styles.input}
          />
          {errors.confirmpassword && <span style={styles.error}>{errors.confirmpassword.message}</span>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #f3e5f5, #e3f2fd)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    fontSize: "0.85rem",
    color: "red",
  },
};

export default NuevoPassword;
