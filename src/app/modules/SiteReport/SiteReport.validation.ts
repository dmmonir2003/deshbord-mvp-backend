import { z } from 'zod';

export const createSiteReportValidationSchema = z.object({
  body: z.object({
      projectId: z.string().min(1),
      overviewText: z.string(),
      title: z.string().optional(),
  }),
});


export const updateSiteReportValidationSchema = z.object({
  body: z.object({
      projectId: z.string().optional(), 
      title: z.string().optional(),
      overviewText: z.string().optional(), 
      overviewFile: z.array(z.string()).optional(), 
      date: z.string().optional(), 
      weather: z.array(z.string()).optional(), 
      workingDays: z.array(z.string()).optional(), 
      LaborTeam: z.array(z.string()).optional(), 
      isDeleted: z.boolean().optional(),
  }),
});
