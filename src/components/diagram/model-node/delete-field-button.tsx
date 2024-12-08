import { Button } from "@/components/ui/button";
import { useDiagram } from "@/store/diagram";
import { ModelField } from "@/types/schema";
import { useNodeId } from "@xyflow/react";
import { Trash2 } from "lucide-react";

interface DeleteFieldButtonProps {
  field: ModelField;
}

export default function DeleteFieldButton({ field }: DeleteFieldButtonProps) {
  const { removeField } = useDiagram();
  const nodeId = useNodeId();

  const deleteField = () => {
    if (!nodeId) return;
    removeField(nodeId, field.name);
  };

  return (
    <Button onClick={deleteField} size="icon" className="h-[20px] w-[30px]">
      <Trash2 />
    </Button>
  );
}
