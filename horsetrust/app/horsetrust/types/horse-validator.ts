import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "video/mp4"];

export const vetExamSchema = z.object({
  vetName: z.string().min(3, "Obligatorio"),
  issuedAt: z.string().min(1, "Obligatorio"),
  role: z.string().min(1, "Obligatorio"),
  // SOLUCIÓN: Usamos 'message' directamente, NO 'errorMap'
  examType: z.enum(["basic", "advanced"], { message: "Selecciona tipo" }),
  examResult: z.enum(["apt", "with_observations"], { message: "Selecciona resultado" }),
  file: z.any()
    .refine((files: any) => files?.length === 1, "Archivo requerido")
    .refine((files: any) => files?.[0]?.size <= MAX_FILE_SIZE, "Max 50MB")
});

export const horseSchema = z.object({
  name: z.string().min(2, "Obligatorio"),
  age: z.preprocess((val) => Number(val), z.number().min(0)),
  sex: z.enum(["male", "female"], { message: "Selecciona sexo" }),
  discipline: z.enum(["racing", "jumping", "dressage", "recreational"], { message: "Selecciona disciplina" }),
  breed: z.string().min(1, "Obligatorio")
});