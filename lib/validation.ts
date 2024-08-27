import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Le nom d'utilisateur doit avoir au moins 2 caractères.")
    .max(50, "Le nom d'utilisateur doit avoir au plus 50 caractères"),
  email: z.string().email("Format email invalide"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Numéro de télephone invalide"
    ),
});
