import { z } from "@/lib/pt-zod";

export const modelFormSchema = z.object({
  name: z.string().min(1),
  mapName: z.string().optional(),
});
