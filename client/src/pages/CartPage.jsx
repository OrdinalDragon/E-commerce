import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../features/cart/cartSlice.js';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleQty = (item, newQty) => {
    if (newQty < 1) return;
    const max = item.stock || 99;
    if (newQty > max) return;
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const handleRemove = (productId, name) => {
    dispatch(removeFromCart(productId));
    toast.success(`${name} eliminado del carrito`);
  };

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalItems = cartItems.reduce((acc, i) => acc + i.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-sm mx-auto">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-sm text-gray-500 mb-6">
            Agregá productos desde la tienda y volvé acá para completar tu compra.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sadness to-fear text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm"
            >
              <Link to={`/product/${item.product}`} className="w-20 h-20 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product}`}
                  className="text-sm font-semibold text-gray-900 hover:text-sadness transition-colors truncate block"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  ${item.price.toFixed(2)} c/u
                </p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQty(item, item.qty - 1)}
                  disabled={item.qty <= 1}
                  className="px-2.5 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center text-xs font-medium text-gray-900 select-none">
                  {item.qty}
                </span>
                <button
                  onClick={() => handleQty(item, item.qty + 1)}
                  disabled={item.qty >= (item.stock || 99)}
                  className="px-2.5 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => handleRemove(item.product, item.name)}
                className="p-2 text-gray-300 hover:text-anger transition-colors"
                title="Eliminar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h2>

            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between text-gray-500">
                  <span className="truncate max-w-[180px]">{item.name} × {item.qty}</span>
                  <span className="font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-600">
                Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Link
              to="/shipping"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-joy to-anger text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              Proceder al pago
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
