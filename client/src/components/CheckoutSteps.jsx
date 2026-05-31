const steps = [
  { label: 'Iniciar sesión', step: 1 },
  { label: 'Envío', step: 2 },
  { label: 'Pago', step: 3 },
  { label: 'Confirmar', step: 4 },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const active = step4 ? 4 : step3 ? 3 : step2 ? 2 : step1 ? 1 : 0;

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, i) => {
          const isActive = s.step <= active;
          const isLast = i === steps.length - 1;
          return (
            <div key={s.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-sadness to-fear text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isActive ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.step
                  )}
                </div>
                <span className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${
                  isActive ? 'text-sadness' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-1.25rem] ${
                  s.step < active ? 'bg-sadness' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
