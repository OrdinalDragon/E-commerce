import { useState } from 'react';
import { useGetProductsQuery } from '../features/api/productApi.js';
import ProductCard from '../components/ProductCard.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import { ProductCardSkeleton } from '../components/ui/Skeleton.jsx';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home',
  'Books',
  'Sports',
];

const HomePage = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const params = { page, limit: 8 };
  if (keyword.trim()) params.keyword = keyword.trim();
  if (category !== 'All') params.category = category;

  const { data, isLoading, isError, error } = useGetProductsQuery(params);

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <HeroBanner />

      <section id="products-grid" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sadness/40 focus:border-sadness bg-white"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                category === cat
                  ? 'bg-sadness text-white border-sadness shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sadness hover:text-sadness'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load products</p>
            <p className="text-red-500 text-sm mt-1">{error?.data?.message || error?.error || 'Something went wrong'}</p>
            <button
              onClick={() => setPage(1)}
              className="mt-4 text-sm text-red-600 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-300 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 hover:border-sadness hover:text-sadness disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                      p === page
                        ? 'bg-sadness text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-sadness hover:text-sadness'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 hover:border-sadness hover:text-sadness disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;
