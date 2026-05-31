import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiTruck, FiCheckCircle } from 'react-icons/fi';
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from '../../features/api/orderApi.js';
import Skeleton from '../../components/ui/Skeleton.jsx';
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

  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data, isLoading, isError, error } = useGetOrderDetailsQuery(id);
  const [deliverOrder, { isLoading: delivering }] = useDeliverOrderMutation();

  const order = data?.data;

  const handleDeliver = async () => {
    try {
      await deliverOrder(id).unwrap();
      toast.success('Orden marcada como entregada', {
        style: { background: '#FFD93D', color: '#1f2937' },
        iconTheme: { primary: '#1f2937', secondary: '#FFD93D' },
      });
    } catch {
      toast.error('Error al actualizar la orden', {
        style: { background: '#FF6B6B', color: '#fff' },
        iconTheme: { primary: '#fff', secondary: '#FF6B6B' },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2 mt-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-semibold">Error al cargar la orden</p>
        <p className="text-red-500 text-sm mt-1">{error?.data?.message || error?.error}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-sm font-medium text-red-600 underline hover:no-underline"
        >
          Volver a órdenes
        </button>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.itemsPrice;
  const isAdmin = userInfo?.role === 'admin';
  const canDeliver = isAdmin && order.isPaid && !order.isDelivered;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/orders')}
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
                    <p className="text-xs text-gray-400">
                      ${item.price?.toFixed(2)} x {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Dirección de envío
            </h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.user?.name}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sin dirección registrada</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Información del pago
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Estado:</span>
                {order.isPaid ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <FiCheckCircle size={14} />
                    Pagado
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-anger bg-anger/10 px-2.5 py-0.5 rounded-full">
                    Pendiente
                  </span>
                )}
              </div>
              {order.isPaid && (
                <p className="text-gray-500">
                  Fecha de pago: {formatDate(order.paidAt)}
                </p>
              )}
              {order.paymentResult?.id && (
                <p className="text-gray-500">
                  ID de transacción: <span className="font-mono text-xs">{order.paymentResult.id}</span>
                </p>
              )}
              {order.paymentResult?.email_address && (
                <p className="text-gray-500">
                  Email: {order.paymentResult.email_address}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Resumen
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span>
                  {order.shippingPrice === 0 ? (
                    <span className="text-emerald-600 font-medium">Gratis</span>
                  ) : (
                    `$${order.shippingPrice?.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Impuestos (13%)</span>
                <span>${order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Estado de envío
            </h2>
            <div className="flex items-center gap-2 mb-4">
              {order.isDelivered ? (
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-sm font-semibold">
                  <FiCheckCircle size={16} />
                  Entregado
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Pendiente
                </span>
              )}
            </div>
            {order.isDelivered && (
              <p className="text-xs text-gray-400">
                Fecha: {formatDate(order.deliveredAt)}
              </p>
            )}

            {canDeliver && (
              <button
                onClick={handleDeliver}
                disabled={delivering}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-disgust to-emerald-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {delivering ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <FiTruck size={18} />
                    Marcar como Entregado
                  </>
                )}
              </button>
            )}

            {order.isDelivered && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <FiCheckCircle className="inline-block text-emerald-600 mb-1" size={24} />
                <p className="text-sm font-semibold text-emerald-700">Orden completada</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Entregada el {formatDate(order.deliveredAt)}
                </p>
              </div>
            )}

            {!order.isPaid && !order.isDelivered && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  Esperando confirmación de pago
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
