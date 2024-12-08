import { Model } from "@/types/schema";
import { Handle, Position } from "@xyflow/react";
import { P } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import NodeFields from "./fields";

import ModelNodeToolbar from "./toolbar";

interface Props {
  data: Model;
}

export default function ModelNode({ data }: Props) {
  console.log("data: ", data);
  return (
    <div className="p-2 bg-slate-300 rounded min-w-52 shadow-md">
      <Handle type="target" position={Position.Top} />
      <ModelNodeToolbar />
      <div className="spacing-1">
        <P>
          Model: <b>{data.name}</b>
        </P>
        <Separator />
        <NodeFields />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
