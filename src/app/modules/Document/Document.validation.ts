import { z } from 'zod';

export const createDocumentValidationSchema = z.object({
  body: z.object({
      title: z.string(),
      projectId: z.string(),
      // isDeleted: z.boolean().default(false),
  }),
});

export const updateDocumentValidationSchema = z.object({
  body: z.object({
      title: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
