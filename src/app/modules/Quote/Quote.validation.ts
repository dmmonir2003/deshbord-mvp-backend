import { z } from 'zod';

export const createQuoteValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1),
      projectId: z.string().min(1),
      value: z.number().min(1),
  }),
})

export const updateQuoteValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1).optional(),
      projectId: z.string().optional(),
      file: z.string().optional(),
      noteId: z.string().optional(),
      value: z.number().min(1).optional(),
  }),
});
