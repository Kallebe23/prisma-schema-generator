import { Separator } from "@/components/ui/separator";
import { Model } from "@/types/schema";
import { Node, useNodeId, useNodesData } from "@xyflow/react";
import { Fragment } from "react";
import DeleteFieldButton from "./delete-field-button";

export default function ModelFields() {
  const nodeId = useNodeId();
  const node = useNodesData<Node<Model>>(nodeId || "");
  const fields = node?.data.fields || [];

  return (
    <div className="spacing-y-1">
      {fields.map((field, index) => (
        <Fragment key={field.name}>
          <div className="p-1 flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              <span>{field.name}</span>
              <span>
                {field.type}
                {field.isList && "[]"}
                {field.isOptional && "?"}
              </span>
              {field.attributes?.map((attr) => (
                <span key={attr.name}>{attr.name}</span>
              ))}
            </div>
            <DeleteFieldButton field={field} />
          </div>
          {index < fields.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
}
