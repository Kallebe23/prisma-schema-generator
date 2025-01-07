import { RelationShipDialogState } from "@/types/store";
import { create } from "zustand";

export const useRelationshipDialog = create<RelationShipDialogState>((set) => ({
  isOpen: false,
  connection: null,
  openDialog: (connection) => set({ isOpen: true, connection }),
  closeDialog: () => set({ isOpen: false, connection: null }),
}));
