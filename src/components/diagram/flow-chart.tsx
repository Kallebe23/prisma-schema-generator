"use client";

import "@xyflow/react/dist/style.css";

import { useDiagram } from "@/store/diagram";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
} from "@xyflow/react";
import ModelNode from "./model-node";
import { ModelEdge } from "./model-edge";
import { useRelationshipDialog } from "@/store/dialogs";

const nodeTypes = { model: ModelNode };
const edgeTypes = { model: ModelEdge };

export default function FlowChart() {
  const { nodes, edges, hasHydrated, onNodesChange, onEdgesChange } =
    useDiagram();
  const { openDialog } = useRelationshipDialog();

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={hasHydrated ? nodes : []}
      edges={hasHydrated ? edges : []}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => {
        openDialog(connection);
      }}
      connectionMode={ConnectionMode.Loose}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
