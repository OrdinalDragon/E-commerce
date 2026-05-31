import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new ApiError(400, 'No order items'));
    }

    const productIds = [...new Set(orderItems.map((item) => item.product))];
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const computedItems = orderItems.map((item) => {
      const product = productMap.get(item.product);
      if (!product) {
        throw new ApiError(404, `Product ${item.product} not found`);
      }
      if (product.stock < item.qty) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }
      return {
        name: product.name,
        qty: item.qty,
        image: product.images[0] || '',
        price: product.price,
        product: product._id,
      };
    });

    const itemsPrice = Number(
      computedItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    );
    const taxPrice = Number((itemsPrice * 0.13).toFixed(2));
    const shippingPrice = itemsPrice >= 100 ? 0 : 10;
    const totalPrice = Number(
      (itemsPrice + taxPrice + shippingPrice).toFixed(2)
    );

    const order = await Order.create({
      user: req.user._id,
      orderItems: computedItems,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new ApiError(403, 'Not authorized to view this order'));
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({}),
    ]);

    res.json({
      success: true,
      data: orders,
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

export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [salesAgg, totalOrders, totalUsers] = await Promise.all([
      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' },
            },
            sales: { $sum: '$totalPrice' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            sales: { $round: ['$sales', 2] },
            count: 1,
          },
        },
      ]),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    const totalSales = salesAgg.reduce((acc, m) => acc + m.sales, 0);

    res.json({
      success: true,
      data: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalUsers,
        monthlySales: salesAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};
