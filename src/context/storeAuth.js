import {create} from "zustand";
import {persist} from "zustand/middleware";

const storeAuth = create(
    persist(
        (set)=>({
            token:null,
            usuario:null,
            rol:null,

            setToken: (token)=> set({token}),
            setUsuario: (usuario) => set ({usuario}),
            setRol: (rol)=>set({rol}),

            clearAuth: () => set({ token: null, usuario: null, rol: null }),
        }),
        {
            name: "auth", // clave en localStorage
            partialize: (state) => ({
                token: state.token,
                usuario: state.usuario,
                rol: state.rol,
            }), 
        }

    )
)
export default storeAuth;