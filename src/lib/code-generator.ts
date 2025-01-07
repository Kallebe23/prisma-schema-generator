import { Model } from "@/types/schema";
import { isStringsArray } from "@/utils";

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

        const argsCount = attribute.arguments?.length
          ? attribute.arguments.length
          : 0;

        if (attribute.arguments && argsCount > 0) {
          code += "(";

          attribute.arguments.forEach((arg, index) => {
            if (arg.value) {
              let value = "";

              if (Array.isArray(arg.value) && isStringsArray(arg.value)) {
                value = `[${arg.value.join(", ")}]`;
              }

              code += `${arg.name}: ${value}`;
              if (index < argsCount - 1) code += ", ";
            }
          });

          code += ")";
        }
      });

      code += "\n"; // go to next field
    });

    code += "}\n";
  });

  return code;
}
