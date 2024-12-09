"use client";

import "@xyflow/react/dist/style.css";

import { useDiagram } from "@/store/diagram";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Connection,
} from "@xyflow/react";
import ModelNode from "./model-node";
import { ModelEdge } from "./model-edge";
import AddRelationDialog from "./add-relation-dialog";
import { useState } from "react";

const nodeTypes = { model: ModelNode };
const edgeTypes = { model: ModelEdge };

export default function FlowChart() {
  const { nodes, edges, hasHydrated, onNodesChange, onEdgesChange } =
    useDiagram();
  const [pendingRelationship, setPendingRelationship] =
    useState<Connection | null>(null);

  return (
    <>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={hasHydrated ? nodes : []}
        edges={hasHydrated ? edges : []}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => {
          setPendingRelationship(connection);
        }}
        connectionMode={ConnectionMode.Loose}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <AddRelationDialog
        pendingRelationship={pendingRelationship}
        onClose={() => {
          setPendingRelationship(null);
        }}
      />
    </>
  );
}
