import React, { useMemo } from "react";
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useDiagram } from "@/store/diagram";

export function ModelEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps<Edge<{ label: string }>>) {
  const { removeRelation, nodes } = useDiagram();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleRemoveRelation = () => {
    removeRelation(id);
  };

  const { sourceNode, targetNode } = useMemo(() => {
    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);
    return { sourceNode, targetNode };
  }, [nodes, source, target]);

  const relationType = useMemo(() => {
    if (!sourceNode || !targetNode) return "";

    const sourceOccurences = sourceNode.data.fields.filter(
      (sourceField) => sourceField.type === targetNode.data.name
    );

    const targetOccurences = targetNode.data.fields.filter(
      (sourceField) => sourceField.type === sourceNode.data.name
    );

    const hasListInSource = sourceOccurences.some(
      (sourceField) => sourceField.isList
    );
    const hasListInTarget = targetOccurences.some(
      (targetField) => targetField.isList
    );

    if (!hasListInSource && !hasListInTarget) return "1-1";
    if (hasListInSource && !hasListInTarget) return "1-n";
    if (hasListInSource && hasListInTarget) return "m-n";
  }, [sourceNode, targetNode]);

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            padding: 8,
            background: "#dfdfdf",
            border: "2px solid #aaa",
            position: "absolute",
            pointerEvents: "all",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="relative rounded-full"
        >
          {relationType}
          {selected && (
            <Button
              className="p-2 h-[24px] w-[24px] rounded-full absolute top-[-20px]"
              size="icon"
              variant="outline"
              onClick={handleRemoveRelation}
            >
              <X />
            </Button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
