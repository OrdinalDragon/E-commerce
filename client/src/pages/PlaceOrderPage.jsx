import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../features/api/orderApi.js';
import { clearCart } from '../features/cart/cartSlice.js';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import toast from 'react-hot-toast';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress) navigate('/shipping');
    else if (!paymentMethod) navigate('/payment');
  }, [shippingAddress, paymentMethod, navigate]);

  if (!shippingAddress || !paymentMethod) return null;

  const itemsPrice = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= 100 ? 0 : 10;
  const taxPrice = Number((itemsPrice * 0.13).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const handlePlaceOrder = async () => {
    try {
      const result = await createOrder({
        orderItems: cartItems.map((i) => ({
          name: i.name,
          qty: i.qty,
          image: i.image,
          price: i.price,
          product: i.product,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: Number(itemsPrice.toFixed(2)),
        taxPrice,
        shippingPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCart());
      toast.success('Pedido realizado con éxito');
      navigate(`/orders/${result.data._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Error al crear el pedido');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirmar pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Dirección de envío</h2>
            <p className="text-sm text-gray-600">
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Método de pago</h2>
            <p className="text-sm font-medium text-gray-700">{paymentMethod}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Productos ({cartItems.length})
            </h2>
            <div className="divide-y divide-gray-50">
              {cartItems.map((item, i) => (
                <div key={item.product} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      ${item.price.toFixed(2)} x {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span className={shippingPrice === 0 ? 'text-emerald-600 font-medium' : 'text-gray-900 font-medium'}>
                  {shippingPrice === 0 ? 'Gratis' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Impuestos (13%)</span>
                <span className="text-gray-900 font-medium">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading || cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-joy to-anger text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                'Realizar pedido'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
