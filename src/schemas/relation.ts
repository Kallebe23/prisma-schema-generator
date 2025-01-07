import { z } from "@/lib/pt-zod";
import { RelationshipType } from "@/types/relationship";

export const relationFormSchema = z.object({
  sourceRelationName: z.string().min(1, "O nome do campo é obrigatório."),
  targetRelationName: z.string().min(1, "O nome do campo é obrigatório."),
  relationName: z.string().optional(),
  relationshipType: z.nativeEnum(RelationshipType),
  references: z.array(z.string()).min(1),
  fields: z.array(z.string()),
  onDelete: z.enum(["CASCADE", "SET_NULL", "NO_ACTION", "RESTRICT"]).optional(),
  onUpdate: z.enum(["CASCADE", "SET_NULL", "NO_ACTION", "RESTRICT"]).optional(),
});
