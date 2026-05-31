import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../features/cart/cartSlice.js';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

const methods = [
  { value: 'PayPal', label: 'PayPal', icon: '💳' },
  { value: 'Stripe', label: 'Stripe', icon: '💎' },
];

const PaymentPage = () => {
  const { paymentMethod } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(paymentMethod || methods[0].value);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(selected));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Método de pago</h1>
        <p className="text-sm text-gray-500 mb-6">Seleccioná cómo querés pagar tu compra</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {methods.map((m) => (
            <label
              key={m.value}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                selected === m.value
                  ? 'border-sadness bg-sadness/5 ring-1 ring-sadness/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.value}
                checked={selected === m.value}
                onChange={() => setSelected(m.value)}
                className="w-4 h-4 text-sadness accent-sadness"
              />
              <span className="text-lg">{m.icon}</span>
              <span className="text-sm font-medium text-gray-900">{m.label}</span>
            </label>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sadness to-fear text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm mt-2"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
