import { z } from 'zod';

export const createSecondFixFileValidationSchema = z.object({
  body: z.object({
      secondFixSubFolder: z.string(),
      title: z.string(),
      room: z.string(),
      surface: z.string(),
      productCode: z.string(),
      suplierName: z.string(),
      text: z.string(),
      projectId: z.string(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateSecondFixFileValidationSchema = z.object({
  body: z.object({
    file: z.string().optional(),
      title: z.string().optional(),
       room: z.string().optional(),
      surface: z.string().optional(),
      productCode: z.string().optional(),
      suplierName: z.string().optional(),
      text: z.string().optional(),
      secondFixSubFolder: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
