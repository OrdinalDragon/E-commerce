import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';
import StarRating from './StarRating.jsx';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        qty: 1,
      })
    );
    toast.success(`${product.name} agregado al carrito`);
  };

  const imageSrc = product.images?.[0];

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden animate-fade-in"
    >
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-xs font-medium text-sadness bg-sadness/10 px-2.5 py-1 rounded-full w-fit">
          {product.category}
        </span>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-sadness transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-auto">
          <StarRating value={product.ratings} size={14} />
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-joy to-anger text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            Agregar
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
