import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useDiagram } from "@/store/diagram";
import { NodeToolbar, useNodeId } from "@xyflow/react";
import { Trash } from "lucide-react";
import AddFieldDialog from "./add-field-dialog";

export default function ModelNodeToolbar() {
  const { removeModel } = useDiagram();
  const nodeId = useNodeId();

  const deleteModel = () => {
    if (nodeId) {
      removeModel(nodeId);
    }
  };

  return (
    <NodeToolbar align="end" className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={deleteModel}
              className="roun rounded-full"
              variant="destructive"
              size="icon"
            >
              <Trash />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remover modelo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <AddFieldDialog />
          </TooltipTrigger>
          <TooltipContent>
            <p>Adicionar campo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </NodeToolbar>
  );
}
