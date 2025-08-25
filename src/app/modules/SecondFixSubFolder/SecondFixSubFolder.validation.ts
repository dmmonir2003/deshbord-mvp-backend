import { z } from 'zod';

export const createSecondFixSubFolderValidationSchema = z.object({
  body: z.object({
   title: z.string().min(1),
      secondFixFolderId: z.string(),
      projectId: z.string(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateSecondFixSubFolderValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1).optional(),
      secondFixFolderId: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
