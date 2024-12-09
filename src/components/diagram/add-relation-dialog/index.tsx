"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { useDiagram } from "@/store/diagram";
import { Connection } from "@xyflow/react";
import { useMemo } from "react";
import { z } from "@/lib/pt-zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import MultipleSelector from "@/components/ui/multi-select";

interface AddRelationDialogProps {
  onClose: () => void;
  pendingRelationship: Connection | null;
}

enum RelationshipType {
  ONE_TO_ONE = "ONE_TO_ONE",
  ONE_TO_MANY = "ONE_TO_MANY",
  MANY_TO_MANY = "MANY_TO_MANY",
}

const relationFormSchema = z.object({
  relationFieldName: z.string().min(1, "O nome do campo é obrigatório."),
  relationFieldId: z.string().min(1, "O nome do campo ID é obrigatório."),
  relationName: z.string().optional(),
  relationshipType: z.nativeEnum(RelationshipType),
  fields: z.array(z.string()),
  references: z.array(z.string()),
  onDelete: z.enum(["CASCADE", "SET_NULL", "NO_ACTION", "RESTRICT"]).optional(),
  onUpdate: z.enum(["CASCADE", "SET_NULL", "NO_ACTION", "RESTRICT"]).optional(),
});

export default function AddRelationDialog({
  onClose,
  pendingRelationship,
}: AddRelationDialogProps) {
  const { nodes } = useDiagram();

  const form = useForm<z.infer<typeof relationFormSchema>>({
    resolver: zodResolver(relationFormSchema),
    defaultValues: {
      relationName: "",
      relationFieldId: "",
      relationFieldName: "",
      relationshipType: RelationshipType.ONE_TO_ONE,
      fields: [],
      references: [],
    },
  });

  const { sourceModel, targetModel } = useMemo(() => {
    const sourceModel = nodes.find(
      (node) => node.id === pendingRelationship?.source
    );
    const targetModel = nodes.find(
      (node) => node.id === pendingRelationship?.target
    );

    return { sourceModel, targetModel };
  }, [pendingRelationship, nodes]);

  function saveModel({ relationName }: z.infer<typeof relationFormSchema>) {
    console.log(relationName);
  }

  const fieldOptions = useMemo(() => {
    return (
      sourceModel?.data.fields.map((field) => ({
        label: field.name,
        value: field.name,
      })) || []
    );
  }, [sourceModel]);

  return (
    <Dialog
      open={!!pendingRelationship}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-[1280px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Adicionar relação | {sourceModel?.data.name || ""} ↔{" "}
            {targetModel?.data?.name || ""}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveModel)} className="space-y-2">
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="relationFieldName"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[320px]">
                    <FormLabel>Nome do campo de relação</FormLabel>
                    <FormControl>
                      <Input placeholder="Exemplo: author" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome do campo que representará a relação. Exemplo:{" "}
                      <code>author</code>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationFieldId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do campo ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Exemplo: authorId" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome do campo que armazenará o identificador da relação.
                      Exemplo: <code>authorId</code>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationName"
                render={({ field }) => (
                  <FormItem className="flex-1 max-w-[280px] min-w-[200px]">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da relação" {...field} />
                    </FormControl>
                    <FormDescription>
                      Opcional, usado para ambiguidade em relações
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationshipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de relação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de relação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RelationshipType.ONE_TO_ONE}>
                          Um para um
                        </SelectItem>
                        <SelectItem value={RelationshipType.ONE_TO_MANY}>
                          Um para muitos
                        </SelectItem>
                        <SelectItem value={RelationshipType.MANY_TO_MANY}>
                          Muitos para muitos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Veja as relações suportadas pelo prisma na{" "}
                      <Link
                        style={{ textDecoration: "underline" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations#types-of-relations"
                      >
                        documentação oficial
                      </Link>
                      .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Campos de origem (fields) <b>{sourceModel?.data.name}</b>
                    </FormLabel>
                    <MultipleSelector
                      value={fieldOptions.filter((o) =>
                        field?.value?.includes(o.value)
                      )}
                      onChange={(options) => {
                        field.onChange(options.map((o) => o.value));
                      }}
                      defaultOptions={fieldOptions}
                      placeholder="Selecione um campo de origem"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          Sem resultados encontrados.
                        </p>
                      }
                    />
                    <FormDescription>
                      Campos da tabela de origem que fazem referência à tabela
                      alvo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Campos referenciados (references){" "}
                      <b>{targetModel?.data.name}</b>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange([value])} // Se for um único campo
                      defaultValue={field.value?.[0] || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um campo referenciado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {targetModel?.data.fields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Campos da tabela alvo que são referenciados.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="onDelete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportamento ao deletar (onDelete)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o comportamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASCADE">CASCADE</SelectItem>
                        <SelectItem value="SET_NULL">SET_NULL</SelectItem>
                        <SelectItem value="NO_ACTION">NO_ACTION</SelectItem>
                        <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="onUpdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportamento ao atualizar (onUpdate)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o comportamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASCADE">CASCADE</SelectItem>
                        <SelectItem value="SET_NULL">SET_NULL</SelectItem>
                        <SelectItem value="NO_ACTION">NO_ACTION</SelectItem>
                        <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">
              <Save />
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
