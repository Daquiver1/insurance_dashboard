import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import { Policy, PolicyType } from "../../types";

const COLORS = {
  Health: "#dc2626", // red-600
  Auto: "#f87171", // red-400
  Home: "#fca5a5", // red-300
};

interface PolicyDistributionChartProps {
  policies: Policy[];
}

const PolicyDistributionChart: React.FC<PolicyDistributionChartProps> = ({
  policies,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();

  // Process data with additional metrics
  const processData = () => {
    const typeData: Record<
      PolicyType,
      { count: number; totalPremium: number }
    > = {
      Health: { count: 0, totalPremium: 0 },
      Auto: { count: 0, totalPremium: 0 },
      Home: { count: 0, totalPremium: 0 },
    };

    policies.forEach((policy) => {
      typeData[policy.type].count += 1;
      typeData[policy.type].totalPremium += policy.premiumAmount;
    });

    return Object.entries(typeData).map(([type, data]) => ({
      name: type,
      value: data.count,
      premium: data.totalPremium,
      percentage: (data.count / policies.length) * 100,
    }));
  };

  const data = processData();

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.name} className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{item.name}</p>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">
              {item.percentage.toFixed(1)}% of total
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} policies ($${data
                  .find((d) => d.name === name)
                  ?.premium.toLocaleString()})`,
                name,
              ]}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PolicyDistributionChart;
