"use client";

import { useEffect, useState } from "react";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { useDiagram } from "@/store/diagram";
import { generatePrismaSchema } from "@/lib/code-generator";

export function CodeViewer() {
  const [code, setCode] = useState("");

  const { nodes } = useDiagram();

  useEffect(() => {
    const models = nodes
      .filter((node) => node.type === "model")
      .map((node) => node.data);

    const code = generatePrismaSchema(models);

    setCode(code);
  }, [nodes]);

  return (
    <div className="min-w-[400px] max-w-[600px]">
      <CodeBlock code={code} />
      <CopyButton code={code} className="absolute top-4 right-4" />
    </div>
  );
}
