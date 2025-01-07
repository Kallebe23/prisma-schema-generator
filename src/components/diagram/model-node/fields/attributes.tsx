import { ModelFieldAttribute } from "@/types/schema";

export function FieldAttributes({
  attributes,
}: {
  attributes: ModelFieldAttribute[];
}) {
  return attributes.map((attribute) => {
    const args = attribute.arguments?.map((arg) => `${arg.name}: ${arg.value}`);

    const attributeArgs = args && args.length ? `(${args.join(", ")})` : "";

    return `${attribute.name}${attributeArgs} `;
  });
}
