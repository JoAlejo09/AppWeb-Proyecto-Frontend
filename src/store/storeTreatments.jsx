import { create } from "zustand"
import axios from "axios";
import { toast } from "react-toastify";

const storeTreatments = create(set => ({
    modal: false,
    toggleModal: (modalType) => set((state) => ({ modal: state.modal === modalType ? null : modalType })),

    registerTreatments: async (data) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("auth-token"));
            const url = `${import.meta.env.VITE_BACKEND_URL}/tratamiento/registro`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedUser.state.token}`,
                }
            };
            const respuesta = await axios.post(url, data, options);
            set((state) => ({ modal: !state.modal }));
            toast.success(respuesta.data.msg);
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar el tratamiento psicológico.");
        }
    },

    deleteTreatments: async (id) => {
        const isConfirmed = confirm("¿Estás seguro de eliminar este tratamiento psicológico?");
        if (isConfirmed) {
            try {
                const storedUser = JSON.parse(localStorage.getItem("auth-token"));
                const url = `${import.meta.env.VITE_BACKEND_URL}/tratamiento/${id}`;
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedUser.state.token}`,
                    }
                };
                const respuesta = await axios.delete(url, options);
                toast.success(respuesta.data.msg);
            } catch (error) {
                console.error(error);
                toast.error("Error al eliminar el tratamiento.");
            }
        }
    },

    payTreatments: async (data) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("auth-token"));
            const url = `${import.meta.env.VITE_BACKEND_URL}/tratamiento/pago`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedUser.state.token}`,
                }
            };
            const respuesta = await axios.post(url, data, options);
            set((state) => ({ modal: !state.modal }));
            toast.success(respuesta.data.msg);
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar el pago del tratamiento.");
        }
    }
}));

export default storeTreatments;
