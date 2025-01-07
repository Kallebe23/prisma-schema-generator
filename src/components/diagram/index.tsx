"use client";
import ModelFormDialog from "./model-form-dialog";
import FlowChart from "./flow-chart";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useModelDialogStore } from "@/store/model";
import AddRelationDialog from "./add-relation-dialog";

export default function Diagram() {
  const { openDialog } = useModelDialogStore();

  return (
    <div className="flex-1 relative">
      <Button
        onClick={() => {
          openDialog("add");
        }}
        className="absolute z-10 top-2 right-2"
      >
        <Plus /> Adicionar modelo
      </Button>
      <FlowChart />
      <AddRelationDialog />
      <ModelFormDialog />
    </div>
  );
}
