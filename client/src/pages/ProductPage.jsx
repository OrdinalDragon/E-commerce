import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../features/api/productApi.js';
import { addToCart } from '../features/cart/cartSlice.js';
import StarRating from '../components/StarRating.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isError, error } = useGetProductDetailsQuery(id);
  const product = data?.data;

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      qty,
      stock: product.stock,
    }));
    toast.success(`${product.name} agregado al carrito`);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-red-600 font-semibold text-lg">Producto no encontrado</p>
          <p className="text-red-500 text-sm mt-2">{error?.data?.message || error?.error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 px-5 py-2 rounded-lg transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [];
  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedImage
                      ? 'border-sadness ring-1 ring-sadness/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block text-xs font-semibold text-sadness bg-sadness/10 px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating value={product.ratings} size={18} />
            <span className="text-sm text-gray-400">
              {product.numReviews} {product.numReviews === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>

          <p className="text-3xl font-bold text-gray-900">
            ${product.price?.toFixed(2)}
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            {inStock ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                En stock ({product.stock} {product.stock === 1 ? 'unidad' : 'unidades'})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-anger bg-anger/10 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-anger rounded-full" />
                Agotado
              </span>
            )}
          </div>

          {inStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="px-3.5 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm font-medium text-gray-900 select-none">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  className="px-3.5 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-joy to-anger text-gray-900 font-bold py-3.5 px-10 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {inStock ? 'Agregar al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
