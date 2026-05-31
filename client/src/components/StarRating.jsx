const StarRating = ({ value = 0, size = 16 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" style={{ width: size * 5 + 4 }}>
      {stars.map((star) => {
        const fill = value >= star ? 'full' : value >= star - 0.5 ? 'half' : 'empty';
        return (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            className="flex-shrink-0"
          >
            <defs>
              <linearGradient id={`star-${star}-${value}`}>
                <stop offset={fill === 'half' ? '50%' : fill === 'full' ? '100%' : '0%'} stopColor="#f59e0b" />
                <stop offset={fill === 'half' ? '50%' : fill === 'full' ? '0%' : '100%'} stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={fill === 'full' ? '#f59e0b' : fill === 'half' ? `url(#star-${star}-${value})` : '#d1d5db'}
            />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
