import { FieldAttributeName } from "@/types/schema-enums";
import { attributeColumns } from "./columns";
import { AttributesTable, DataTableProps } from "./data-table";
import { ModelFieldFormType } from "..";
import { useFormContext } from "react-hook-form";

export default function FieldAttributes({}) {
  const methods = useFormContext<ModelFieldFormType>();

  const handleRowSelectionChange: DataTableProps["onSelectedAttributesChange"] =
    (newRowSelection) => {
      const selectedAttributes = Object.keys(newRowSelection).map((rowId) => ({
        name: rowId as FieldAttributeName,
        arguments: [],
      }));
      methods.setValue("attributes", selectedAttributes);
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
