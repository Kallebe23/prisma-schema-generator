import {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Connection,
} from "@xyflow/react";
import { Model, ModelField } from "./schema";

export interface DiagramState {
  nodes: Node<Model, "model">[];
  edges: Edge[];

  onNodesChange: OnNodesChange<Node<Model, "model">>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  removeRelation: (edgeId: string) => void;

  addModel: (model: Model, position: { x: number; y: number }) => void;
  editModel: (model: Model, nodeId: string) => void;
  removeModel: (id: string) => void;

  addField: (nodeId: string, field: ModelField) => void;
  removeField: (nodeId: string, fieldName: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export interface ModelDialogState {
  isOpen: boolean;
  mode: "add" | "edit";
  nodeId?: string; // Pode ser tipado conforme necessário
  openDialog: (mode: "add" | "edit", nodeId?: string) => void;
  closeDialog: () => void;
}

export interface RelationShipDialogState {
  isOpen: boolean;
  connection: Connection | null;
  openDialog: (connection: Connection) => void;
  closeDialog: () => void;
}
