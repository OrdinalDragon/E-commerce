const HeroBanner = () => {
  const scrollToProducts = () => {
    document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-joy/30 via-sadness/20 to-fear/20">
      <div className="absolute inset-0 bg-gradient-to-r from-joy/10 via-transparent to-anger/10 animate-gradient bg-[length:200%_200%]" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-joy via-anger to-fear bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Descubrí
            </span>
            <br />
            <span className="text-gray-900">lo que te mueve</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-lg mx-auto md:mx-0">
            Productos seleccionados que despiertan alegría, encienden la pasión y le dan vida a cada emoción.
          </p>
          <button
            onClick={scrollToProducts}
            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-sadness via-fear to-anger text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-[length:200%_auto] animate-gradient"
          >
            Explorar colección
            <svg className="w-5 h-5 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-tr from-joy/40 via-sadness/30 to-fear/40 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: '😄', color: 'bg-joy/20', label: 'Joy' },
                  { emoji: '😢', color: 'bg-sadness/20', label: 'Sadness' },
                  { emoji: '😡', color: 'bg-anger/20', label: 'Anger' },
                  { emoji: '😨', color: 'bg-fear/20', label: 'Fear' },
                ].map((emotion) => (
                  <div
                    key={emotion.label}
                    className={`${emotion.color} backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm animate-float`}
                    style={{ animationDelay: `${Math.random() * 3}s` }}
                  >
                    <span className="text-3xl">{emotion.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{emotion.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
