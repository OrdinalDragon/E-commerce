import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../features/cart/cartSlice.js';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

const ShippingPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (shippingAddress) {
      setForm(shippingAddress);
    }
  }, [shippingAddress]);

  const validate = () => {
    const errs = {};
    if (!form.address.trim()) errs.address = 'La dirección es obligatoria';
    if (!form.city.trim()) errs.city = 'La ciudad es obligatoria';
    if (!form.postalCode.trim()) errs.postalCode = 'El código postal es obligatorio';
    if (!form.country.trim()) errs.country = 'El país es obligatorio';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(saveShippingAddress(form));
    navigate('/payment');
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-anger/60 focus:ring-anger/30'
        : 'border-gray-200 focus:border-sadness focus:ring-sadness/30'
    }`;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dirección de envío</h1>
        <p className="text-sm text-gray-500 mb-6">Completá los datos para recibir tu pedido</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Av. Siempre Viva 123"
              className={inputClass('address')}
            />
            {errors.address && <p className="text-xs text-anger mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Buenos Aires"
              className={inputClass('city')}
            />
            {errors.city && <p className="text-xs text-anger mt-1">{errors.city}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Código postal</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="1424"
                className={inputClass('postalCode')}
              />
              {errors.postalCode && <p className="text-xs text-anger mt-1">{errors.postalCode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">País</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Argentina"
                className={inputClass('country')}
              />
              {errors.country && <p className="text-xs text-anger mt-1">{errors.country}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sadness to-fear text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm mt-2"
          >
            Continuar al pago
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
