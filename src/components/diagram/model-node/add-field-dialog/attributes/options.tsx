import { FieldAttributeName } from "@/types/schema-enums";
import { ReactNode } from "react";

interface FieldAttributeOption {
  value: FieldAttributeName;
  label: string;
  icon?: ReactNode;
}

export const fieldAttributeOptions: FieldAttributeOption[] = [
  {
    value: FieldAttributeName.id,
    label: FieldAttributeName.id,
  },
  {
    value: FieldAttributeName.default,
    label: FieldAttributeName.default,
  },
  {
    value: FieldAttributeName.ignore,
    label: FieldAttributeName.ignore,
  },
  {
    value: FieldAttributeName.map,
    label: FieldAttributeName.map,
  },
  {
    value: FieldAttributeName.relation,
    label: FieldAttributeName.relation,
  },
  {
    value: FieldAttributeName.unique,
    label: FieldAttributeName.unique,
  },
  {
    value: FieldAttributeName.updatedAt,
    label: FieldAttributeName.updatedAt,
  },
];
