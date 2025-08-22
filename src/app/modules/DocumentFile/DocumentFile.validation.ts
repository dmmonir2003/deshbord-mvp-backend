import { z } from 'zod';

export const createDocumentFileValidationSchema = z.object({
  body: z.object({
      documentSubFolderId: z.string(),
      projectId: z.string(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateDocumentFileValidationSchema = z.object({
  body: z.object({
      file: z.string().optional(),
      documentSubFolderId: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
