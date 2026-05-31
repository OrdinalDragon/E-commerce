import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(1),
  description: z.string({ required_error: 'Description is required' }).trim().min(1),
  price: z.number({ required_error: 'Price is required' }).positive('Price must be positive'),
  category: z.string({ required_error: 'Category is required' }).trim().min(1),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.string()).optional(),
});

const updateProductSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  price: z.number().positive('Price must be positive').optional(),
  category: z.string().trim().min(1).optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
});

const reviewSchema = z.object({
  rating: z
    .number({ required_error: 'Rating is required' })
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z.string({ required_error: 'Comment is required' }).trim().min(1),
});

export { createProductSchema, updateProductSchema, reviewSchema };
