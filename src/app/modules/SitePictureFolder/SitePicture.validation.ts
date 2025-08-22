import { z } from 'zod';

export const createSitePictureValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    projectId: z.string(),
  }),
});

export const updateSitePictureValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    projectId: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});
