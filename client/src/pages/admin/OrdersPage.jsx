import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { useGetOrdersQuery } from '../../features/api/orderApi.js';
import Pagination from '../../components/ui/Pagination.jsx';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetOrdersQuery({ page, limit: 15 });
  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
        <p className="text-sm text-gray-500 mt-1">Todas las compras realizadas en la tienda</p>
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse border-b border-gray-50 last:border-0 pb-4 last:pb-0">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Error al cargar las órdenes</p>
          <p className="text-red-500 text-sm mt-1">{error?.data?.message || error?.error}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Pago</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Envío</th>
                  <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">No hay órdenes registradas todavía.</td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-400">
                        #{o._id.slice(-8)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{o.user?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{o.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-gray-900">
                        ${o.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        {o.isPaid ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit">
                              Pagado
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{formatDate(o.paidAt)}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-anger bg-anger/10 px-2.5 py-0.5 rounded-full">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {o.isDelivered ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit">
                              Entregado
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{formatDate(o.deliveredAt)}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${o._id}`)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-sadness hover:text-blue-700 transition-colors"
                        >
                          <FiEye size={15} />
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="px-4 py-3 border-t border-gray-100">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                showInfo
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
