"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fieldTypes } from "./field-type-options";
import { ControllerRenderProps } from "react-hook-form";
import { ModelFieldFormType } from ".";

export function FieldTypeCombobox({
  field,
}: {
  field: ControllerRenderProps<ModelFieldFormType, "type">;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedValue = React.useMemo(() => {
    return fieldTypes.find((fieldType) => fieldType.value === field.value);
  }, [field]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {field.value ? (
            <>
              {selectedValue?.icon}
              {selectedValue?.label}
            </>
          ) : (
            "Selecione um tipo..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar tipo..." />
          <CommandList>
            <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
            <CommandGroup>
              {fieldTypes.map((fieldType) => (
                <CommandItem
                  key={fieldType.value}
                  value={fieldType.value}
                  onSelect={() => {
                    field.onChange(fieldType.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === fieldType.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {fieldType.icon}
                  {fieldType.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
