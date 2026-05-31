import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import validate from '../utils/validate.js';
import { createOrderSchema } from '../validations/orderValidation.js';

const router = Router();

router.route('/')
  .post(protect, validate(createOrderSchema), createOrder)
  .get(protect, admin, getOrders);

router.get('/stats/dashboard', protect, admin, getDashboardStats);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, admin, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router;
