import { z } from "zod"; // [SOLUCIÓN: Importación de Zod que faltaba]

// [SOLUCIÓN: Definición de constantes para evitar 'Cannot find name']
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const vetExamSchema = z.object({
  vetName: z.string().min(3, "El nombre del veterinario es obligatorio"),
  issuedAt: z.string().min(1, "La fecha es obligatoria"),
  
  // [SOLUCIÓN: Cambio de 'errorMap' a 'message' para eliminar el error de Overload]
  examType: z.enum(["basic", "advanced"], {
    message: "Selecciona un tipo válido (Básico o Avanzado)", //
  }),
  
  examResult: z.enum(["apt", "with_observations"], {
    message: "Selecciona un resultado válido", //
  }),
  
  file: z
    .any()
    // [SOLUCIÓN: Añadimos ': any' al parámetro 'files' para evitar el error de 'any type' implícito]
    .refine((files: any) => files?.length === 1, "El PDF es obligatorio") //
    .refine((files: any) => files?.[0]?.size <= MAX_FILE_SIZE, "Máximo 5MB") //
    .refine((files: any) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Solo PDF"), //
});