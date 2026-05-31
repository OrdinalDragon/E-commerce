import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-4 py-3">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-lg font-bold text-sadness">
        ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-gray-400">{payload[0].payload.count} orders</p>
    </div>
  );
};

const MonthlySalesChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: `${MONTH_NAMES[item.month - 1]} ${item.year}`,
    sales: item.sales,
    count: item.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-6">
        Monthly Sales
      </h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No sales data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B8DEF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5B8DEF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#5B8DEF"
              strokeWidth={2}
              fill="url(#salesGradient)"
              activeDot={{ r: 5, fill: '#5B8DEF', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlySalesChart;
