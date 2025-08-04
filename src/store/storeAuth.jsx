import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const storeAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      rol: null,
      setAuth: ({ token, user, rol }) => set({ token, user, rol }),
      logout: () => set({ token: null, user: null, rol: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        rol: state.rol,
      }),
    }
  )
);

export default storeAuth;
