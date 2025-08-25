import { z } from 'zod';

export const createTimeScheduleValidationSchema = z.object({
  body: z.object({
      title: z.string().min(1),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      projectId: z.string().min(1),
      description: z.string().optional(),
      isDeleted: z.boolean().default(false),
  }),
});

export const updateTimeScheduleValidationSchema = z.object({
  body: z.object({

      title: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  
  }),
});
