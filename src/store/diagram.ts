import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { DiagramState } from "@/types/store";

export const useDiagram = create<DiagramState>()(
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
      removeRelation: (edgeId) => {
        const edge = get().edges.find((edge) => edge.id === edgeId);
        if (!edge) return;

        const targetNode = get().nodes.find((node) => node.id === edge.target);
        const sourceNode = get().nodes.find((node) => node.id === edge.source);
        set({
          nodes: get().nodes.map((node) => {
            return {
              ...node,
              data: {
                ...node.data,
                fields: node.data.fields.filter(
                  (field) =>
                    field.type !== targetNode?.data.name &&
                    field.type !== sourceNode?.data.name
                ),
              },
            };
          }),
          edges: get().edges.filter((edge) => edge.id !== edgeId),
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
      editModel: (model, nodeId: string) =>
        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (nodeId === node.id) {
              return {
                ...node,
                data: model,
              };
            }
            return node;
          }),
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
