import { Model } from "@/types/schema";
import { Fragment, useMemo } from "react";
import { FieldAttributes } from "./attributes";
import DeleteFieldButton from "../delete-field-button";
import { Separator } from "@/components/ui/separator";

export default function ModelFields({ fields }: { fields: Model["fields"] }) {
  const filteredFields = useMemo(() => {
    return fields.filter(
      (field) => !field.attributes.find((attr) => attr.name === "@relation")
    );
  }, [fields]);

  return (
    <div className="spacing-y-1">
      {filteredFields.map((field, index) => (
        <Fragment key={field.name}>
          <div className="p-1 flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              <span>{field.name}</span>
              <span>
                {field.type}
                {field.isList && "[]"}
                {field.isOptional && "?"}
              </span>
              <FieldAttributes attributes={field.attributes} />
            </div>
            <DeleteFieldButton field={field} />
          </div>
          {index < fields.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
}
