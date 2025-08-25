import { z } from 'zod';

export const createSnaggingValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1),
      projectId: z.string().min(1),
      description: z.string().optional(),
      isDeleted: z.boolean().default(false),

  }),
});

export const updateSnaggingValidationSchema = z.object({
  body: z.object({

      title: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      file: z.string().optional(),
      completeFile: z.string().optional(),
      status: z.boolean().optional(),
      isDeleted: z.boolean().optional(),

  }),
});
