import { create } from "zustand";

interface StoreState {
  count: number;
  inc: () => void;
}

const useCount = create<StoreState>((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

export default useCount;
