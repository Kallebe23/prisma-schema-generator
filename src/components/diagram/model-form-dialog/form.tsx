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
// import { useReactFlow } from "@xyflow/react";
import { useMemo } from "react";
import { useModelDialogStore } from "@/store/model";
import { modelFormSchema } from "@/schemas/model";

export default function ModelForm() {
  const { addModel, editModel, nodes } = useDiagram();
  // const { screenToFlowPosition } = useReactFlow();
  const { nodeId, closeDialog, mode } = useModelDialogStore();

  const modelNode = useMemo(() => {
    return nodes.find((node) => node.id === nodeId);
  }, [nodeId, nodes]);

  const form = useForm<z.infer<typeof modelFormSchema>>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: modelNode?.data.name || "",
    },
  });

  function saveModel({ name }: z.infer<typeof modelFormSchema>) {
    if (!name) return;

    if (mode === "add") {
      const alreadyAddedModel = nodes.find((node) => node.data.name === name);

      if (!!alreadyAddedModel) {
        toast.error("Modelo já adicionado");
        return;
      }

      addModel(
        {
          name: name.replaceAll(" ", "_"),
          fields: [],
        },
        { x: 120, y: 120 }
      );
    }

    if (mode === "edit" && modelNode && nodeId) {
      editModel(
        {
          ...modelNode.data,
          name: name.replaceAll(" ", "_"),
        },
        nodeId
      );
    }

    toast.success("Modelo salvo!");
    form.reset();
    closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(saveModel)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do modelo (User, Post, Category...)"
                  spellCheck={false}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="mapName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Tabela - @map</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome da tabela (Opcional)"
                  spellCheck={false}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit">
          <Save />
          Salvar
        </Button>
      </form>
    </Form>
  );
}
