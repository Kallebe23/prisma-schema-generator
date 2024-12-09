import { Model } from "@/types/schema";

export function generatePrismaSchema(models: Model[]) {
  let code = ``;

  // fill each model
  models.forEach((model) => {
    code += `\nmodel ${model.name} {\n`;

    // fill each model field
    model.fields.forEach((field) => {
      let fieldTypeModifier = "";
      if (field.isList) fieldTypeModifier = "[]";
      if (field.isOptional) fieldTypeModifier = "?";

      code += `\t${field.name} ${field.type}${fieldTypeModifier}`;

      // fill each field attribute
      field.attributes.forEach((attribute) => {
        code += ` ${attribute.name}`;
      });

      code += "\n"; // go to next field
    });

    code += "}\n";
  });

  return code;
}
