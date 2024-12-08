"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModelForm from "./form";
import { useState } from "react";

export default function ModelFormDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute top-2 right-2">
          <Plus /> Adicionar modelo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar modelo</DialogTitle>
          <ModelForm
            onModelSave={() => {
              setOpen(false);
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
