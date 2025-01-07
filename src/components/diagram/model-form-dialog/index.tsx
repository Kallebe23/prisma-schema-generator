"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import ModelForm from "./form";
import { useModelDialogStore } from "@/store/model";

export default function ModelFormDialog() {
  const { isOpen, closeDialog } = useModelDialogStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar modelo</DialogTitle>
          <ModelForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
