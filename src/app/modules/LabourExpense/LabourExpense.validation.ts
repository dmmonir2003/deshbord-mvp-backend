import { z } from 'zod';

export const createLabourExpenseValidationSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }),
    projectId: z.string({ required_error: 'projectId is required' }),
    days: z.number({ required_error: 'Days is required' }),
    vat: z.number().optional(),

    amount: z.number().optional(),
    file: z.string().optional(),
    labourId: z
      .string({ required_error: 'Labour ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    date: z.string().optional(),
    description: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updateLabourExpenseValidationSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }).optional(),
    projectId: z.string({ required_error: 'projectId is required' }).optional(),
    days: z.number({ required_error: 'Days is required' }).optional(),
    vat: z.number().optional(),
    amount: z.number({ required_error: 'Amount is required' }).optional(),
    file: z.string().optional(),
    labourId: z
      .string({ required_error: 'Labour ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId').optional(),
    date: z.string().optional(),
    description: z.string().optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});
