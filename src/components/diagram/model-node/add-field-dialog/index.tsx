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
import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "@/lib/pt-zod";
import { useDiagram } from "@/store/diagram";
import { FieldAttributeName, ModelFieldScalarType } from "@/types/schema-enums";
import { useNodeId } from "@xyflow/react";
import { FieldTypeCombobox } from "./field-type-combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import FieldAttributes from "./attributes";
// import { FieldAttributesSelect } from "./field-attributes-select";

export const modelFieldFormSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(ModelFieldScalarType),
  isOptional: z.boolean().default(false),
  isList: z.boolean().default(false),
  attributes: z
    .object({
      name: z.nativeEnum(FieldAttributeName),
      arguments: z
        .object({
          name: z.string().min(1),
          value: z.string().min(1),
        })
        .array(),
    })
    .array(),
});

export type ModelFieldFormType = z.infer<typeof modelFieldFormSchema>;

export default function AddFieldDialog() {
  const [open, setOpen] = useState(false);
  const { nodes, addField } = useDiagram();
  const nodeId = useNodeId();

  const selectedNode = useMemo(() => {
    return nodes.find((node) => node.id === nodeId);
  }, [nodes, nodeId]);

  const form = useForm<ModelFieldFormType>({
    resolver: zodResolver(modelFieldFormSchema),
    defaultValues: {
      name: "",
      attributes: [],
      isList: false,
      isOptional: false,
      type: ModelFieldScalarType.Int,
    },
  });

  function saveField(data: ModelFieldFormType) {
    if (!nodeId) return;

    const alreadyAddedField = !!selectedNode?.data.fields.find(
      (field) => field.name === data.name
    );

    if (alreadyAddedField) {
      toast.error("Campo já adicionado");
      return;
    }

    addField(nodeId, data);

    toast.success("Campo adicionado!");
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline" size="icon">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modelo: {selectedNode?.data.name || ""} - Adicionar campo
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveField)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do campo (name, password...)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 flex-wrap items-end">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <FieldTypeCombobox field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="isOptional"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("isList", false);
                              }
                              field.onChange(checked);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Opcional</FormLabel>
                          <FormDescription></FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isList"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("isOptional", false);
                              }
                              field.onChange(checked);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Lista</FormLabel>
                          <FormDescription></FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <FieldAttributes />
              <Button type="submit">
                <Save />
                Salvar
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
