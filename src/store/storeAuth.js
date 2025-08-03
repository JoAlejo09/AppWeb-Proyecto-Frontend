import { create } from 'zustand';

const storeAuth = create((set) => ({
  token: null,
  user: null,
  rol: null,
  setAuth: ({ token, user, rol }) => set({ token, user, rol }),
  logout: () => set({ token: null, user: null, rol: null }),
}));

export default storeAuth;