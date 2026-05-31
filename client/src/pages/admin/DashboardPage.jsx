import { FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { useGetDashboardStatsQuery } from '../../features/api/orderApi.js';
import StatCard from '../../components/admin/StatCard.jsx';
import MonthlySalesChart from '../../components/admin/MonthlySalesChart.jsx';

const DashboardPage = () => {
  const { data, isLoading, isError, error, refetch } = useGetDashboardStatsQuery();

  const stats = data?.data;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-red-600 font-semibold text-lg">Failed to load dashboard</p>
          <p className="text-red-500 text-sm mt-2">
            {error?.data?.message || error?.error || 'Something went wrong'}
          </p>
          <button
            onClick={refetch}
            className="mt-5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 px-5 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={FiDollarSign}
          label="Total Sales"
          value={stats?.totalSales}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          skeleton={isLoading}
        />
        <StatCard
          icon={FiShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders}
          gradient="bg-gradient-to-br from-sadness to-blue-700"
          skeleton={isLoading}
        />
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats?.totalUsers}
          gradient="bg-gradient-to-br from-fear to-purple-700"
          skeleton={isLoading}
        />
      </div>

      <MonthlySalesChart data={stats?.monthlySales} />
    </div>
  );
};

export default DashboardPage;
