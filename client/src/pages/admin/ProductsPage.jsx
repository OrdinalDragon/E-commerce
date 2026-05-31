import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useGetProductsQuery, useDeleteProductMutation } from '../../features/api/productApi.js';
import Pagination from '../../components/ui/Pagination.jsx';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetProductsQuery({ page, limit: 10 });
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await deleteProduct(id).unwrap();
      toast.success('Producto eliminado');
      if (products.length === 1 && page > 1) setPage(page - 1);
    } catch {
      toast.error('Error al eliminar el producto');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el catálogo de tu tienda</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-sadness text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus size={18} />
          Nuevo Producto
        </Link>
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Error al cargar los productos</p>
          <p className="text-red-500 text-sm mt-1">{error?.data?.message || error?.error}</p>
          <button onClick={() => setPage(1)} className="mt-4 text-sm text-red-600 underline hover:no-underline">Intentar de nuevo</button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Producto</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Precio</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Categoría</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Stock</th>
                  <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No hay productos todavía.
                      <Link to="/admin/products/new" className="text-sadness font-medium hover:underline ml-1">Crear el primero</Link>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-400">{p._id.slice(-6)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">${p.price.toFixed(2)}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex text-xs font-medium bg-sadness/10 text-sadness px-2.5 py-1 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${
                          p.stock === 0
                            ? 'bg-anger/10 text-anger'
                            : p.stock < 10
                            ? 'bg-joy/20 text-yellow-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {p.stock === 0 ? 'Sin stock' : `${p.stock} uds`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/products/${p._id}/edit`)}
                            className="p-2 text-gray-400 hover:text-sadness hover:bg-sadness/5 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-2 text-gray-400 hover:text-anger hover:bg-anger/5 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
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

export default ProductsPage;
