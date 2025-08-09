import { z } from 'zod';

export const createInterimValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    projectId: z.string().min(1),
    value: z.number().min(1),
  }),
});

export const updateInterimValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    projectId: z.string().optional(),
    file: z.string().optional(),
    status: z.string().optional(),
    value: z.number().min(1).optional(),
  }),
});
