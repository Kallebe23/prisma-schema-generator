import { Model, ModelField } from "@/types/schema";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Diagram {
  nodes: Node<Model, "model">[];
  edges: Edge[];

  onNodesChange: OnNodesChange<Node<Model, "model">>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  addModel: (model: Model, position: { x: number; y: number }) => void;
  removeModel: (id: string) => void;

  addField: (nodeId: string, field: ModelField) => void;
  removeField: (nodeId: string, fieldName: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useDiagram = create<Diagram>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection) => {
        set({
          edges: addEdge(
            {
              ...connection,
              type: "model",
            },
            get().edges
          ),
        });
      },

      addModel: (model, position) =>
        set((state) => ({
          nodes: [
            ...state.nodes,
            {
              id: uuidv4(),
              position,
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
        edges: state.edges,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
