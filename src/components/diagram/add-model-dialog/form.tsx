"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "@/lib/pt-zod";
import { useDiagram } from "@/store/diagram";
import { useReactFlow } from "@xyflow/react";

const modelFormSchema = z.object({
  name: z.string().min(1),
});

interface ModelFormProps {
  onModelSave: () => void;
}

export default function ModelForm({ onModelSave }: ModelFormProps) {
  const { addModel, nodes } = useDiagram();
  const { screenToFlowPosition } = useReactFlow();
  const form = useForm<z.infer<typeof modelFormSchema>>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function saveModel({ name }: z.infer<typeof modelFormSchema>) {
    if (!name) return;

    const alreadyAddedModel = !!nodes.find((node) => node.data.name === name);

    if (alreadyAddedModel) {
      toast.error("Modelo já adicionado");
      return;
    }

    const { x, y } = screenToFlowPosition({
      x: window.innerWidth / 2 - 300,
      y: window.innerHeight / 2,
    });
    addModel(
      {
        name,
        fields: [],
      },
      { x, y }
    );

    toast.success("Modelo adicionado!");
    form.reset();
    onModelSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(saveModel)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do modelo (User, Post, Category...)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <Save />
          Salvar
        </Button>
      </form>
    </Form>
  );
}
