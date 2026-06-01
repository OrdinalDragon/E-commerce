import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

export const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, price, page: queryPage, limit: queryLimit } = req.query;

    const filter = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (price) {
      const priceFilter = {};
      if (price.min) priceFilter.$gte = Number(price.min);
      if (price.max) priceFilter.$lte = Number(price.max);
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }

    const page = Math.max(1, parseInt(queryPage, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(queryLimit, 10) || 20));
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'client') {
      return next(new ApiError(403, 'Only clients can leave reviews'));
    }

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return next(new ApiError(400, 'Product already reviewed'));
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });

    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.numReviews;

    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImage = (req, res) => {
  res.json({ url: req.fileUrl });
};
