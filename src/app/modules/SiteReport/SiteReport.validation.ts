import { z } from 'zod';

export const createSiteReportValidationSchema = z.object({
  body: z.object({
      projectId: z.string().min(1),
      overviewText: z.string(),
  }),
});


export const updateSiteReportValidationSchema = z.object({
  body: z.object({
      projectId: z.string().optional(), 
      overviewText: z.string().optional(), 
      overviewFile: z.string().optional(), 
      date: z.string().optional(), 
      weather: z.string().optional(),
      workingDays: z.string().optional(),
      LaborTeam: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
