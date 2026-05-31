import { z } from 'zod';

const orderItemSchema = z.object({
  name: z.string({ required_error: 'Product name is required' }),
  qty: z.number({ required_error: 'Quantity is required' }).int().positive(),
  image: z.string({ required_error: 'Image URL is required' }),
  price: z.number({ required_error: 'Price is required' }).positive(),
  product: z.string({ required_error: 'Product ID is required' }),
});

const createOrderSchema = z.object({
  orderItems: z
    .array(orderItemSchema, { required_error: 'Order items are required' })
    .nonempty('At least one order item is required'),
  shippingAddress: z.object({
    address: z.string({ required_error: 'Address is required' }).trim().min(1),
    city: z.string({ required_error: 'City is required' }).trim().min(1),
    postalCode: z.string({ required_error: 'Postal code is required' }).trim().min(1),
    country: z.string({ required_error: 'Country is required' }).trim().min(1),
  }),
  paymentMethod: z.string().optional(),
  itemsPrice: z.number().positive(),
  taxPrice: z.number().min(0),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().positive(),
});

export { createOrderSchema };
