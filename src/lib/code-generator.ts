import { Model } from "@/types/schema";

export function generatePrismaSchema(models: Model[]) {
  const schema = models.map((model) => {
    const modelAttributes = model.attributes
      .map(({ name, type, modifiers }) => {
        const modifiersString = modifiers ? ` ${modifiers.join(" ")}` : "";
        return `  ${name} ${type}${modifiersString}`;
      })
      .join("\n");

    return `model ${model.name} {\n${modelAttributes}\n}`;
  });

  return schema.join("\n\n");
}
