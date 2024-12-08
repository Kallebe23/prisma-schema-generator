"use client";

import "@xyflow/react/dist/style.css";

import { useDiagram } from "@/store/diagram";
import { Model } from "@/types/schema";
import {
  OnNodesChange,
  applyNodeChanges,
  ReactFlow,
  Background,
  Controls,
  Node,
  MiniMap,
} from "@xyflow/react";
import { useCallback } from "react";
import ModelNode from "./model-node";

const nodeTypes = { model: ModelNode };

export default function FlowChart() {
  const { nodes, setNodes, hasHydrated } = useDiagram();

  const onNodesChange: OnNodesChange<Node<Model, "model">> = useCallback(
    (changes) => setNodes(applyNodeChanges(changes, nodes)),
    [setNodes, nodes]
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={hasHydrated ? nodes : []}
      onNodesChange={onNodesChange}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
