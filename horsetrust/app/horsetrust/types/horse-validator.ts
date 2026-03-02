import { z } from "zod"; // [SOLUCIÓN] Importación vital

// [SOLUCIÓN] Definición de constantes faltantes
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export const vetExamSchema = z.object({
  vetName: z.string().min(3, "El nombre del veterinario es obligatorio"),
  issuedAt: z.string().min(1, "La fecha es obligatoria"),
  role: z.string().min(1, "El propósito es obligatorio"),
  
  // [SOLUCIÓN] Usamos 'message' directamente como pide el log de error
  examType: z.enum(["basic", "advanced"], { 
    message: "Selecciona un tipo válido (Básico o Avanzado)" 
  }),
  
  examResult: z.enum(["apt", "with_observations"], { 
    message: "Selecciona un resultado válido" 
  }),
  
  file: z
    .any()
    // [SOLUCIÓN] Tipado 'any' explícito para evitar error de seguridad
    .refine((files: any) => files?.length === 1, "El archivo es obligatorio")
    .refine((files: any) => files?.[0]?.size <= MAX_FILE_SIZE, "Máximo 50MB")
    .refine((files: any) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Formato no soportado")
});