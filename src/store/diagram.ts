import { Model, ModelField } from "@/types/schema";
import { Node } from "@xyflow/react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Diagram {
  nodes: Node<Model, "model">[];
  setNodes: (newNodes: Node<Model, "model">[]) => void;

  addModel: (model: Model) => void;
  removeModel: (id: string) => void;

  addField: (nodeId: string, field: ModelField) => void;
  removeField: (nodeId: string, fieldName: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useDiagram = create<Diagram>()(
  persist(
    (set) => ({
      nodes: [
        {
          id: uuidv4(),
          type: "model",
          data: {
            fields: [],
            name: "Users",
          },
          position: { x: 120, y: 120 },
        },
      ],
      setNodes: (nodes) => set({ nodes }),
      addModel: (model) =>
        set((state) => ({
          nodes: [
            ...state.nodes,
            {
              id: uuidv4(),
              position: {
                x: 0,
                y: 0,
              },
              data: model,
              type: "model",
            },
          ],
        })),
      removeModel: (id) =>
        set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
      addField: (nodeId, field) => {
        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  fields: [...node.data.fields, field],
                },
              };
            }
            return node;
          }),
        }));
      },
      removeField: (nodeId, fieldName) => {
        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  fields: node.data.fields.filter(
                    (field) => field.name !== fieldName
                  ),
                },
              };
            }
            return node;
          }),
        }));
      },
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => {
        set({
          hasHydrated,
        });
      },
    }),
    {
      name: "diagram-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
