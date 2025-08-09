import { z } from 'zod';

export const createLiveProjectCostValidationSchema = z.object({
  body: z.object({
    LiveProjectCost: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      atcCodes: z.string().min(1),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateLiveProjectCostValidationSchema = z.object({
  body: z.object({
    LiveProjectCost: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      atcCodes: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
