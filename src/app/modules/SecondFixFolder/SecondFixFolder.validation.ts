import { z } from 'zod';

export const createSecondFixFolderValidationSchema = z.object({
  body: z.object({
      title: z.string(),
      projectId: z.string(),
  }),
});

export const updateSecondFixFolderValidationSchema = z.object({
  body: z.object({
 title: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
