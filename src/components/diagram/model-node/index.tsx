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
  return (
    <div className="p-2 bg-slate-300 rounded min-w-52 shadow-md">
      <ModelNodeToolbar />
      <div className="spacing-1">
        <P>
          Model: <b>{data.name}</b>
        </P>
        <Separator />
        <NodeFields />
      </div>
      <Handle type="source" position={Position.Top} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Left} id="d" />
    </div>
  );
}
