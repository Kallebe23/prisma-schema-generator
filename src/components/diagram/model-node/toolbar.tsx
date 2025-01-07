import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useDiagram } from "@/store/diagram";
import { NodeToolbar, useNodeId } from "@xyflow/react";
import { Edit, Trash } from "lucide-react";
import AddFieldDialog from "./add-field-dialog";
import { useModelDialogStore } from "@/store/model";

export default function ModelNodeToolbar() {
  const { removeModel } = useDiagram();
  const { openDialog } = useModelDialogStore();
  const nodeId = useNodeId();

  const deleteModel = () => {
    if (nodeId) {
      removeModel(nodeId);
    }
  };

  const editModel = () => {
    if (nodeId) {
      openDialog("edit", nodeId);
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
            <Button
              onClick={editModel}
              className="roun rounded-full"
              variant="outline"
              size="icon"
            >
              <Edit />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar modelo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <AddFieldDialog />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adicionar campo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </NodeToolbar>
  );
}
