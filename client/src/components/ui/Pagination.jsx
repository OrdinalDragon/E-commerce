import { useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const getPageRange = (current, total) => {
  if (total <= 7) return { start: 1, end: total, leftEllipsis: false, rightEllipsis: false };

  if (current <= 5) return { start: 1, end: 7, leftEllipsis: false, rightEllipsis: true };
  if (current >= total - 4) return { start: total - 6, end: total, leftEllipsis: true, rightEllipsis: false };

  return { start: current - 2, end: current + 2, leftEllipsis: true, rightEllipsis: true };
};

const PageButton = ({ page, active, onClick }) => (
  <button
    onClick={() => onClick(page)}
    className={`w-9 h-9 text-sm rounded-lg transition-all ${
      active
        ? 'bg-sadness text-white shadow-sm font-semibold scale-105'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 font-medium'
    }`}
  >
    {page}
  </button>
);

const Ellipsis = () => (
  <span className="w-9 h-9 flex items-center justify-center text-sm text-gray-300 select-none">
    ...
  </span>
);

const Pagination = ({ currentPage, totalPages, onPageChange, showInfo }) => {
  const goTo = useCallback(
    (page) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPage, totalPages, onPageChange]
  );

  if (totalPages <= 1) return null;

  const { start, end, leftEllipsis, rightEllipsis } = getPageRange(currentPage, totalPages);
  const pages = [];

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
      {showInfo && (
        <span className="text-xs text-gray-400 order-2 sm:order-1">
          Página {currentPage} de {totalPages}
        </span>
      )}

      <div className="flex items-center gap-1 order-1 sm:order-1">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <FiChevronLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {leftEllipsis && (
          <>
            <PageButton page={1} active={false} onClick={goTo} />
            <Ellipsis />
          </>
        )}

        {pages.map((p) => (
          <PageButton key={p} page={p} active={p === currentPage} onClick={goTo} />
        ))}

        {rightEllipsis && (
          <>
            <Ellipsis />
            <PageButton page={totalPages} active={false} onClick={goTo} />
          </>
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
