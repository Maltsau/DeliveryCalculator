import { create } from 'zustand';

interface ILine {
  position: number;
  description: string;
  quantity: number;
  price: number;
  isMuted: boolean;
}

type DataFieldType = 'description' | 'price' | 'quantity';

type IStore = {
  version: string;
  delivery: number;
  lines: ILine[];
  isAdvansedMode: boolean;
  setDelivery: (delivery: number) => void;
  addLine: () => void;
  removeLine: (position: number) => void;
  changeDatum: (
    field: DataFieldType,
    position: number,
    datum: string | number
  ) => void;
  clearForm: () => void;
  setAdvansedMode: (value: boolean) => void;
  toggleMuteLine: (position: number) => void;
};

export const useStore = create<IStore>((set) => ({
  version: 'V2.0',
  delivery: 0,
  lines: [
    { position: 1, description: '', quantity: 0, price: 0, isMuted: false },
    { position: 2, description: '', quantity: 0, price: 0, isMuted: false },
    { position: 3, description: '', quantity: 0, price: 0, isMuted: true },
  ],
  isAdvansedMode: false,
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
          isMuted: false,
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
  setAdvansedMode: (value) => set(() => ({ isAdvansedMode: value })),
  toggleMuteLine: (position) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.position === position ? { ...line, isMuted: !line.isMuted } : line
      ),
    })),
}));
