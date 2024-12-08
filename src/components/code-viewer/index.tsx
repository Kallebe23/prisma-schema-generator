"use client";

import { useEffect, useState } from "react";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { useDiagram } from "@/store/diagram";

export function CodeViewer() {
  const [code, setCode] = useState(`
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}
    `);

  const { nodes } = useDiagram();

  useEffect(() => {
    const models = nodes
      .filter((node) => node.type === "model")
      .map((node) => node.data);

    let code = ``;

    // fill each model
    models.forEach((model) => {
      code += `\nmodel ${model.name} {\n`;

      // fill each model field
      model.fields.forEach((field) => {
        let fieldTypeModifier = "";
        if (field.isList) fieldTypeModifier = "[]";
        if (field.isOptional) fieldTypeModifier = "?";

        code += `\t${field.name} ${field.type}${fieldTypeModifier}\n`;
      });

      code += "}\n";
    });

    setCode(code);
  }, [nodes]);

  return (
    <div>
      <CodeBlock code={code} />
      <CopyButton code={code} className="absolute top-4 right-4" />
    </div>
  );
}
