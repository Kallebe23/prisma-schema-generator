"use client";
import { useEffect, useState } from "react";
import { highlight } from "@/lib/highlighter";

export function CodeBlock({ code }: { code: string }) {
  const [nodes, setNodes] = useState(<></>);

  useEffect(() => {
    highlight(code).then(setNodes);
  }, [code]);

  return nodes ?? <></>;
}
