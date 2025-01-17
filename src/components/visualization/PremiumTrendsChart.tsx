import { format, parseISO } from "date-fns";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Policy } from "../../types";

interface PremiumTrendsChartProps {
  policies: Policy[];
}

const PremiumTrendsChart: React.FC<PremiumTrendsChartProps> = ({
  policies,
}) => {
  const processData = () => {
    const dataMap: Record<string, { total: number; count: number }> = {};

    policies.forEach((policy) => {
      const month = format(new Date(policy.startDate), "yyyy-MM");
      if (!dataMap[month]) {
        dataMap[month] = { total: 0, count: 0 };
      }
      dataMap[month].total += policy.premiumAmount;
      dataMap[month].count += 1;
    });

    return Object.entries(dataMap)
      .map(([date, data]) => ({
        date,
        totalPremium: data.total,
        averagePremium: Math.round(data.total / data.count),
        policyCount: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const data = processData();

  const formatYAxis = (value: number) => `$${value.toLocaleString()}`;
  const formatTooltip = (value: number) => `$${value.toLocaleString()}`;

  // Calculate total and average metrics
  const totalPremiums = data.reduce((sum, item) => sum + item.totalPremium, 0);
  const averagePremium = Math.round(totalPremiums / policies.length);

  return (
    <div className="space-y-6">
      {/* Header with metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Premiums</p>
          <p className="text-2xl font-bold text-gray-900">
            ${totalPremiums.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Average Premium</p>
          <p className="text-2xl font-bold text-gray-900">
            ${averagePremium.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), "MMM yyyy")}
            />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(date) =>
                format(parseISO(date as string), "MMMM yyyy")
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalPremium"
              name="Total Premium"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ fill: "#dc2626" }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="averagePremium"
              name="Average Premium"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ fill: "#f87171" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PremiumTrendsChart;
