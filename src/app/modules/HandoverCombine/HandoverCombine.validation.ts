import { z } from 'zod';

export const createHandoverCombineValidationSchema = z.object({
  body: z.object({
      title: z.string().optional(),
      files: z.array(z.string()).min(1),
      projectId: z.string().min(1),
      isDeleted: z.boolean().default(false),
 
  }),
});

export const updateHandoverCombineValidationSchema = z.object({
  body: z.object({
     title: z.string().optional(),
      files: z.array(z.string()).min(1).optional(),
      projectId: z.string().min(1).optional(),
      isDeleted: z.boolean().default(false).optional(),
  }),
});
