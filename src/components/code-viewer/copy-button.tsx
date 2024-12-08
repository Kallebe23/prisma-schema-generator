"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  code: string;
  className?: string;
}

export function CopyButton({ code, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "relative transition-all duration-200 hover:bg-muted",
        isCopied ? "text-green-500" : "text-muted-foreground",
        className
      )}
      onClick={handleCopy}
    >
      <span className="sr-only">
        {isCopied ? "Copied" : "Copy code to clipboard"}
      </span>
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
