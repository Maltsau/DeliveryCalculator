import { create } from 'zustand';

interface ILine {
  position: number;
  description: string;
  quantity: number;
  price: number;
}

type DataFieldType = 'description' | 'price' | 'quantity';

type IStore = {
  version: string;
  delivery: number;
  lines: ILine[];
  setDelivery: (delivery: number) => void;
  addLine: () => void;
  removeLine: (position: number) => void;
  changeDatum: (
    field: DataFieldType,
    position: number,
    datum: string | number
  ) => void;
  clearForm: () => void;
};

export const useStore = create<IStore>((set) => ({
  version: 'V1.0',
  delivery: 0,
  lines: [
    { position: 1, description: '', quantity: 0, price: 0 },
    { position: 2, description: '', quantity: 0, price: 0 },
    { position: 3, description: '', quantity: 0, price: 0 },
  ],
  setDelivery: (delivery) => set(() => ({ delivery })),
  addLine: () =>
    set((state) => ({
      lines: [
        ...state.lines,
        {
          position: state.lines.length + 1,
          description: '',
          price: 0,
          quantity: 0,
        },
      ],
    })),
  removeLine: (position) =>
    set((state) => ({
      lines: state.lines
        .filter((line) => line.position !== position)
        .map((line, index) => ({
          ...line,
          position: index + 1,
        })),
    })),
  changeDatum: (field, position, datum) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.position === position ? { ...line, [field]: datum } : line
      ),
    })),
  clearForm: () =>
    set((state) => ({
      delivery: 0,
      lines: state.lines.map((line) => ({
        ...line,
        quantity: 0,
        price: 0,
      })),
    })),
}));
