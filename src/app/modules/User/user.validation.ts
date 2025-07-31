import { z } from 'zod';

export const createUserValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.object({
        firstName: z.string().nonempty('First Name is required'),
        lastName: z.string().nonempty('Last Name is required'),
      }),
      email: z.string().email('Invalid email format'),
      contactNo: z.string(),
      profileImg: z.string().optional(), // Optional field for file
      status: z.string().optional(), // Optional field with default value
      isDeleted: z.boolean().optional(), // Optional field with default value
    }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  // updateUserValidationSchema,
};



