import { ModelDialogState } from "@/types/store";
import { create } from "zustand";

export const useModelDialogStore = create<ModelDialogState>((set) => ({
  isOpen: false,
  mode: "add",
  nodeId: undefined,
  openDialog: (mode, nodeId) => set({ isOpen: true, mode, nodeId }),
  closeDialog: () => set({ isOpen: false, mode: "add", nodeId: undefined }),
}));
