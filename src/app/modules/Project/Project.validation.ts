import { z } from 'zod';

export const createProjectValidationSchema = z.object({
  body: z.object({
  projectName: z.string(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
    .optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
  address: z.string(),
  contact: z.string(),
  type: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  value: z.number()
  }),
});

export const updateProjectValidationSchema = z.object({
  body: z.object({
      projectName: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
    .optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  contractFile: z.string().optional(),
  status: z.enum(['pending', 'ongoing', 'completed', 'cancelled']).optional(),
  value: z.number().optional()
  }),
});
