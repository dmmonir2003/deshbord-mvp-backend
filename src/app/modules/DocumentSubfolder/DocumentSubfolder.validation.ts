import { z } from 'zod';

export const createDocumentSubfolderValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1),
      documentId: z.string(),
      projectId: z.string(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateDocumentSubfolderValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1).optional(),
      documentId: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
