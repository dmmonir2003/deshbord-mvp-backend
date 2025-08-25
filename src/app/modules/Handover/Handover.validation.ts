import { z } from 'zod';

export const createHandoverValidationSchema = z.object({
  body: z.object({
      title: z.string(),
      projectId: z.string(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateHandoverValidationSchema = z.object({
  body: z.object({
      file: z.string().optional(),
      title: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
