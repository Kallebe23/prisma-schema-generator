import {
  AttributeFunction,
  BlockAttributeName,
  FieldAttributeName,
  ModelFieldScalarType,
} from "./schema-enums";

interface AttributeArgumentFunction {
  name: AttributeFunction;
  args?: string | number | boolean | string[];
}

interface AttributeArgument {
  name: string;
  value: string | number | boolean | string[] | AttributeArgumentFunction[];
}

export interface ModelFieldAttribute {
  name: FieldAttributeName;
  arguments?: AttributeArgument[];
}

interface ModelBlockAttribute {
  name: BlockAttributeName;
  arguments?: AttributeArgument[];
}

export interface ModelField {
  // Must start with a letter
  // Typically spelled in camelCase
  // Must adhere to the following regular expression: [A-Za-z][A-Za-z0-9_]*
  name: string;

  type: ModelFieldScalarType;

  isOptional: boolean;
  isList: boolean;

  attributes?: ModelFieldAttribute[];
}

export type Model = {
  name: string; // must be in PascalCase in singular and must adhere to the following regular expression [A-Za-z][A-Za-z0-9_]*
  fields: ModelField[];
  attributes?: ModelBlockAttribute[];
};
