import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../features/api/productApi.js';
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
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const userInfo = useSelector((state) => state.auth.userInfo);
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

  const canReview =
    userInfo &&
    userInfo.role === 'client' &&
    !product?.reviews?.some((r) => r.user === userInfo._id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating || !reviewComment.trim()) {
      toast.error('Seleccioná una calificación y escribí un comentario');
      return;
    }
    try {
      await createReview({
        id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      }).unwrap();
      toast.success('Reseña publicada');
      setReviewRating(0);
      setReviewComment('');
    } catch (err) {
      toast.error(err?.data?.message || 'Error al publicar la reseña');
    }
  };

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

      <div className="mt-16 border-t border-gray-100 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Reseñas de clientes
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({product.numReviews})
              </span>
            </h2>

            {product.reviews?.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-gray-500 text-sm font-medium">
                  Este producto aún no tiene reseñas
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Sé el primero en opinar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fear to-sadness flex items-center justify-center text-white text-xs font-bold">
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <StarRating value={review.rating} size={15} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Escribe tu reseña
            </h2>

            {!userInfo ? (
              <div className="bg-gradient-to-br from-joy/10 to-fear/10 border border-joy/20 rounded-xl p-8 text-center">
                <svg className="w-10 h-10 mx-auto text-joy mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <p className="text-gray-700 font-medium text-sm mb-3">
                  Iniciá sesión para dejar tu reseña
                </p>
                <Link
                  to={`/login?redirect=/product/${id}`}
                  className="inline-block bg-gradient-to-r from-joy to-anger text-gray-900 font-semibold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm"
                >
                  Iniciar sesión
                </Link>
              </div>
            ) : !canReview ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
                <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-sm">
                  {userInfo?.role !== 'client'
                    ? 'Los administradores no pueden publicar reseñas'
                    : 'Ya opinaste sobre este producto'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <svg
                          width={28}
                          height={28}
                          viewBox="0 0 20 20"
                          className={star <= (hoverRating || reviewRating) ? 'text-joy drop-shadow-sm' : 'text-gray-200'}
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="ml-2 text-sm text-gray-400 self-center">
                        {reviewRating} de 5
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Contá tu experiencia con este producto..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-joy/40 focus:border-joy resize-none transition-shadow"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-joy to-anger text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {submittingReview ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Publicando...
                    </>
                  ) : (
                    'Publicar reseña'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
