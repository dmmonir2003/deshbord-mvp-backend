import { z } from 'zod';

export const createCertificateValidationSchema = z.object({
  body: z.object({
      projectId: z.string().min(1),
      title: z.string().min(1)
  }),
});

export const updateCertificateValidationSchema = z.object({
  body: z.object({
      file: z.string().min(1).optional(),
      projectId: z.string().optional(),
      title: z.string().optional(),
      isDeleted: z.boolean().default(false).optional(),
  }),
});
