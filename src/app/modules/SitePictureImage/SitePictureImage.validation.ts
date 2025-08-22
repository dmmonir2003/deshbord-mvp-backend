import { z } from 'zod';

export const createSitePictureImageValidationSchema = z.object({
  body: z.object({
      projectId: z.string(),
      sitePictureFolderId: z.string().min(1),
  }),
});

export const updateSitePictureImageValidationSchema = z.object({
  body: z.object({
      file: z.array(z.string()).min(1).optional(),
      uploadDate: z.date().optional(),
      projectId: z.string().optional(),
      sitePictureFolderId: z.string().optional(),
      isDeleted: z.boolean().optional(),
  }),
});
