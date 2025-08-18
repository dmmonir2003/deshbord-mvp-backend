import { z } from 'zod';


export const createMaterialExpenseValidationSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }),
    quantity: z.number({ required_error: 'Quantity is required' }),
    projectId: z.string({ required_error: 'projectId is required' }),
    unitPrice: z.number({ required_error: 'unitPrice is required' }),
    vat: z.number().optional(),
    amount: z.number().optional(),
    unit: z.string().optional(),
    file: z.string().optional(),
    materialId: z
      .string({ required_error: 'Labour ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId').optional(),
    date: z.string().optional(),
    description: z.string().optional(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updateMaterialExpenseValidationSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }).optional(),
    quantity: z.number({ required_error: 'Quantity is required' }).optional(),
    unitPrice: z.number({ required_error: 'unitPrice is required' }).optional(),
    projectId: z.string({ required_error: 'projectId is required' }).optional(),
    vat: z.number().optional(),
    amount: z.number().optional(),
    unit: z.string().optional(),
    file: z.string().optional(),
    materialId: z
      .string({ required_error: 'Labour ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId').optional(),
    date: z.string().optional(),
    description: z.string().optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});
