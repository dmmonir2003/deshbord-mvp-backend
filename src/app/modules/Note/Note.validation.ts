import { z } from 'zod';

export const createNoteValidationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, { message: 'Project is required' }),
    clientId: z.string().optional(),
    note: z.string().min(1, { message: 'Note is required' }),
    description: z.string().optional(),
    value: z.number(),
    // date: z.string().min(1, { message: 'Date is required' }), // could be z.date() if using Date type
    // clientComment: z.string().min(1, { message: 'Client comment is required' }),
    // adminComment: z.string().min(1, { message: 'Admin comment is required' }),
    // sharedWith: z.array(sharedWithSchema).optional(),
    // isDeleted: z.boolean().default(false),
  }),
});

export const updateNoteValidationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, { message: 'Project is required' }).optional(),
    clientId: z.string().optional(),
    note: z.string().min(1, { message: 'Note is required' }).optional(),
    description: z.string().optional(),
    value: z.number().optional(),
    date: z.string().min(1, { message: 'Date is required' }).optional(),
    clientComment: z.string().min(1, { message: 'Client comment is required' }).optional(),
    adminComment: z.string().min(1, { message: 'Admin comment is required' }).optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});
