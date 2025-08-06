import { z } from 'zod';

export const createLabourValidationSchema = z.object({
  body: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      address: z.string().optional(),
      UtrNinAddress: z.string().optional(),
      position: z.string().optional(),
      dayRate: z.number().min(1),
  }),
});


export const updateLabourValidationSchema = z.object({
  body: z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      UtrNinAddress: z.string().optional(),
      position: z.string().optional(),
      file: z.string().optional(),
      dayRate: z.number().min(1).optional(),
  }),
});
