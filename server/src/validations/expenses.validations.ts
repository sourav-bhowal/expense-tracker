import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().int().positive("Amount must be a positive integer"),
});
