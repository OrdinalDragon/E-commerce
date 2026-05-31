import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiPackage, FiCreditCard } from 'react-icons/fi';
import { useGetOrderDetailsQuery, usePayOrderMutation } from '../features/api/orderApi.js';
import Skeleton from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetOrderDetailsQuery(id);
  const [payOrder, { isLoading: paying }] = usePayOrderMutation();

  const order = data?.data;

  const handlePay = async () => {
    try {
      await payOrder({
        id,
        paymentId: 'pay_sim_' + Date.now(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: 'cliente@tienda.com',
      }).unwrap();
      toast.success('Pago procesado correctamente');
    } catch {
      toast.error('Error al procesar el pago');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-1/2 mt-3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-red-600 font-semibold text-lg">Orden no encontrada</p>
          <p className="text-red-500 text-sm mt-2">{error?.data?.message || error?.error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-5 text-sm font-medium text-red-600 underline hover:no-underline"
          >
            Volver a mis órdenes
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orden #{order._id.slice(-8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Creada el {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Productos ({order.orderItems?.length || 0})
            </h2>
            <div className="divide-y divide-gray-50">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
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
                    <p className="text-xs text-gray-400">${item.price?.toFixed(2)} x {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Dirección de envío</h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sin dirección registrada</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Estado del pago</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {order.isPaid ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold">
                    <FiCheckCircle size={14} />
                    Pagado
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-anger bg-anger/10 px-3 py-1 rounded-full">
                    Pendiente
                  </span>
                )}
              </div>
              {order.isPaid && (
                <p className="text-gray-500">Fecha: {formatDate(order.paidAt)}</p>
              )}
            </div>

            {!order.isPaid && (
              <div className="mt-5 bg-gradient-to-r from-joy/10 to-anger/10 border border-joy/20 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Completar pago
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Simulación de pago para probar el flujo
                </p>
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {paying ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={18} />
                      Simular pago con MercadoPago / Stripe
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span className={order.shippingPrice === 0 ? 'text-emerald-600 font-medium' : 'text-gray-900 font-medium'}>
                  {order.shippingPrice === 0 ? 'Gratis' : `$${order.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Impuestos</span>
                <span className="text-gray-900 font-medium">${order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Estado de envío</h2>
            <div className="flex items-center gap-2">
              {order.isDelivered ? (
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-sm font-semibold">
                  <FiPackage size={16} />
                  Entregado
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Pendiente
                </span>
              )}
            </div>
            {order.isDelivered && (
              <p className="text-xs text-gray-400 mt-2">Fecha: {formatDate(order.deliveredAt)}</p>
            )}
            {!order.isDelivered && order.isPaid && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <FiPackage className="inline-block text-gray-400 mb-1" size={24} />
                <p className="text-sm text-gray-500">Estamos preparando tu pedido</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
