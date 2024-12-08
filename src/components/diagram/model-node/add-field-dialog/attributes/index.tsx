import { FieldAttributeName } from "@/types/schema-enums";
import { attributeColumns } from "./columns";
import { AttributesTable, DataTableProps } from "./data-table";
import { ModelFieldFormType } from "..";
import { useForm } from "react-hook-form";

export default function FieldAttributes({}) {
  const methods = useForm<ModelFieldFormType>();

  const handleRowSelectionChange: DataTableProps["onSelectedAttributesChange"] =
    (newRowSelection) => {
      const selectedAttributes = Object.keys(newRowSelection).map((rowId) => ({
        name: rowId,
        arguments: [],
      }));
      methods.setValue(
        "attributes",
        selectedAttributes as ModelFieldFormType["attributes"]
      );
    };

  return (
    <AttributesTable
      onSelectedAttributesChange={handleRowSelectionChange}
      columns={attributeColumns}
      data={[
        {
          name: FieldAttributeName.id,
          arguments: [],
        },
        {
          name: FieldAttributeName.default,
          arguments: [],
        },
        {
          name: FieldAttributeName.ignore,
          arguments: [],
        },
        {
          name: FieldAttributeName.map,
          arguments: [],
        },
        {
          name: FieldAttributeName.relation,
          arguments: [],
        },
        {
          name: FieldAttributeName.unique,
          arguments: [],
        },
        {
          name: FieldAttributeName.updatedAt,
          arguments: [],
        },
      ]}
    />
  );
}
