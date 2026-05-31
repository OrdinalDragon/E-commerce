import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice.js';
import { useUpdateProfileMutation } from '../features/api/authApi.js';
import { useGetMyOrdersQuery } from '../features/api/orderApi.js';
import { FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const { data: ordersData, isLoading: loadingOrders } = useGetMyOrdersQuery();

  const orders = ordersData?.data || [];

  useEffect(() => {
    if (userInfo) {
      setForm((prev) => ({ ...prev, name: userInfo.name, email: userInfo.email }));
    }
  }, [userInfo]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    else if (form.name.trim().length < 2) errs.name = 'Mínimo 2 caracteres';

    if (form.password && form.password.length < 6)
      errs.password = 'Mínimo 6 caracteres';

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const body = { name: form.name.trim() };
    if (form.password) body.password = form.password;

    try {
      const result = await updateProfile(body).unwrap();
      dispatch(setCredentials(result.data));
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error(err?.data?.message || 'Error al actualizar el perfil');
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-anger/60 focus:ring-anger/30'
        : 'border-gray-200 focus:border-sadness focus:ring-sadness/30'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Datos personales
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Actualizá tu nombre o contraseña
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass('name')}
                />
                {errors.name && (
                  <p className="text-xs text-anger mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  El email no se puede modificar
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Dejalo vacío para mantenerla"
                  className={inputClass('password')}
                />
                {errors.password && (
                  <p className="text-xs text-anger mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repetí la nueva contraseña"
                  className={inputClass('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-anger mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-joy to-anger text-gray-900 font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {updating ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Mis órdenes
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Historial de todas tus compras
            </p>

            {loadingOrders && (
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 animate-pulse border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loadingOrders && orders.length === 0 && (
              <div className="text-center py-10">
                <svg
                  className="w-16 h-16 text-gray-200 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <p className="text-gray-500 font-medium">
                  Aún no has hecho ninguna compra
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Explorá nuestros productos y realizá tu primer pedido
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-sadness to-fear text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Ir a la tienda
                </button>
              </div>
            )}

            {!loadingOrders && orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        Pagado
                      </th>
                      <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        Envío
                      </th>
                      <th className="text-right pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 font-mono text-xs text-gray-400">
                          #{o._id.slice(-8)}
                        </td>
                        <td className="py-3.5 text-sm text-gray-600">
                          {formatDate(o.createdAt)}
                        </td>
                        <td className="py-3.5 font-semibold text-gray-900">
                          ${o.totalPrice?.toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          {o.isPaid ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              Pagado
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-anger bg-anger/10 px-2.5 py-0.5 rounded-full">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-3.5">
                          {o.isDelivered ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              Entregado
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => navigate(`/orders/${o._id}`)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-sadness hover:text-blue-700 transition-colors"
                          >
                            <FiEye size={14} />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
