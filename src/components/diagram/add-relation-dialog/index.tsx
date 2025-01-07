"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { useDiagram } from "@/store/diagram";
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
import { FieldAttributeName } from "@/types/schema-enums";
import { RelationshipType } from "@/types/relationship";
import { relationFormSchema } from "@/schemas/relation";
import { useRelationshipDialog } from "@/store/dialogs";
import { toast } from "sonner";

export default function AddRelationDialog() {
  const { nodes, addField, onConnect } = useDiagram();
  const { connection: pendingConnection, closeDialog } =
    useRelationshipDialog();

  const form = useForm<z.infer<typeof relationFormSchema>>({
    resolver: zodResolver(relationFormSchema),
    defaultValues: {
      relationName: "",
      sourceRelationName: "",
      targetRelationName: "",
      relationshipType: RelationshipType.ONE_TO_ONE,
      references: [],
      fields: [],
    },
  });

  const { sourceModel, targetModel } = useMemo(() => {
    const sourceModel = nodes.find(
      (node) => node.id === pendingConnection?.source
    );
    const targetModel = nodes.find(
      (node) => node.id === pendingConnection?.target
    );

    return { sourceModel, targetModel };
  }, [pendingConnection, nodes]);

  function saveRelation(data: z.infer<typeof relationFormSchema>) {
    if (!sourceModel || !targetModel || !pendingConnection) return;

    const sourceIdFields = sourceModel.data.fields.filter((field) => {
      return field.attributes.some(
        (attribute) => attribute.name === FieldAttributeName.id
      );
    });

    if (!sourceIdFields.length) {
      toast.error("A tabela de origem precisa ter um campo de ID.");
      return;
    }

    debugger;
    // add source relation field
    addField(sourceModel.id, {
      name: data.sourceRelationName,
      type: targetModel.data.name,
      attributes: [],
      isList:
        data.relationshipType === RelationshipType.ONE_TO_MANY ||
        data.relationshipType === RelationshipType.MANY_TO_MANY,
      isOptional: false,
    });

    let fields = data.fields;

    if (!fields.length) {
      // se o usuário não definir os campos, vamos criar um novo
      const targetRelationFieldName = `${data.targetRelationName}Id`;

      fields = [targetRelationFieldName];

      addField(targetModel.id, {
        name: targetRelationFieldName,
        type: sourceIdFields[0].type, // o tipo do campo de ID
        attributes: [],
        isList: false,
        isOptional: false,
      });
    }

    // add target model field
    addField(targetModel.id, {
      name: data.targetRelationName,
      type: sourceModel.data.name,
      attributes: [
        {
          name: FieldAttributeName.relation,
          arguments: [
            {
              name: "name",
              value: data.relationName || "",
            },
            {
              name: "fields",
              value: fields,
            },
            {
              name: "references",
              value: data.references,
            },
          ],
        },
      ],
      isList: data.relationshipType === RelationshipType.MANY_TO_MANY,
      isOptional: false,
    });

    onConnect(pendingConnection);

    closeDialog();
  }

  const referenceOptions = useMemo(() => {
    return (
      sourceModel?.data.fields.map((field) => ({
        label: field.name,
        value: field.name,
      })) || []
    );
  }, [sourceModel]);

  const targetFieldOptions = useMemo(() => {
    return (
      targetModel?.data.fields.map((field) => ({
        label: field.name,
        value: field.name,
      })) || []
    );
  }, [targetModel]);

  return (
    <Dialog
      open={!!pendingConnection}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <DialogContent className="max-w-[1000px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>
            Você está criando uma relação entre <u>{sourceModel?.data.name}</u>{" "}
            e <u>{targetModel?.data?.name}</u>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(saveRelation)}
            className="space-y-2"
          >
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="relationshipType"
                render={({ field }) => (
                  <FormItem className="max-w-[300px]">
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
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="sourceRelationName"
                  render={({ field }) => (
                    <FormItem className="w-full min-w-[320px]">
                      <FormLabel>
                        Nome da relação que ficará em{" "}
                        <b>{sourceModel?.data.name}</b>
                      </FormLabel>
                      <FormControl>
                        <Input
                          spellCheck={false}
                          placeholder="Exemplo: posts"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome da relação na origem. Exemplo: <code>posts</code>.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetRelationName"
                  render={({ field }) => (
                    <FormItem className="w-full min-w-[320px]">
                      <FormLabel>
                        Nome da relação que ficará em{" "}
                        <b>{targetModel?.data.name}</b>
                      </FormLabel>
                      <FormControl>
                        <Input
                          spellCheck={false}
                          placeholder="Exemplo: author"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome da relação no alvo. Exemplo: <code>author</code>.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="references"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Campos referenciados de <b>{sourceModel?.data.name}</b>
                      </FormLabel>
                      <MultipleSelector
                        value={referenceOptions.filter((o) =>
                          field?.value?.includes(o.value)
                        )}
                        onChange={(options) => {
                          field.onChange(options.map((o) => o.value));
                        }}
                        defaultOptions={referenceOptions}
                        placeholder="Selecione os campos"
                        emptyIndicator={
                          <p className="text-center text-md leading-10 text-gray-600 dark:text-gray-400">
                            Sem resultados encontrados.
                          </p>
                        }
                      />
                      <FormDescription>
                        Campos da tabela de origem que são referenciados.
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
                        Campos da relação <b>{targetModel?.data.name}</b>
                      </FormLabel>
                      <MultipleSelector
                        value={targetFieldOptions.filter((o) =>
                          field?.value?.includes(o.value)
                        )}
                        onChange={(options) => {
                          field.onChange(options.map((o) => o.value));
                        }}
                        defaultOptions={targetFieldOptions}
                        placeholder="Selecione os campos"
                        emptyIndicator={
                          <p className="text-center text-md leading-10 text-gray-600 dark:text-gray-400">
                            Sem resultados encontrados.
                          </p>
                        }
                      />
                      <FormDescription>
                        Campos da tabela alvo que serão usados para montar a
                        relação. <br />
                        Se deixar vazio um novo nome será criado usando o tipo
                        de relação e o nome da tabela alvo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
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
              <FormField
                control={form.control}
                name="relationName"
                render={({ field }) => (
                  <FormItem className="flex-1 max-w-[280px] min-w-[200px]">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        spellCheck={false}
                        placeholder="Nome da relação"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Opcional, usado para ambiguidade em relações
                    </FormDescription>
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
