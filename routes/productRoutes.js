import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  uploadProductImage,
} from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { upload, uploadToS3 } from '../middlewares/uploadMiddleware.js';
import validate from '../utils/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  reviewSchema,
} from '../validations/productValidation.js';

const router = Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, validate(createProductSchema), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, validate(updateProductSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, validate(reviewSchema), createReview);

router.post('/upload', protect, admin, upload.single('image'), uploadToS3, uploadProductImage);

export default router;
