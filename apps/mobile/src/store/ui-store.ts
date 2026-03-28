import { create } from 'zustand';

type UiStore = {
  highlightedTruck: string;
  setHighlightedTruck: (truckCode: string) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  highlightedTruck: 'FT01',
  setHighlightedTruck: (truckCode) => set({ highlightedTruck: truckCode }),
}));
