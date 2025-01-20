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
  Health: "#dc2626", 
  Auto: "#f87171",
  Home: "#fca5a5",
};

interface PolicyDistributionChartProps {
  policies: Policy[];
}

const PolicyDistributionChart: React.FC<PolicyDistributionChartProps> = ({
  policies,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();
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

    const totalPolicies = policies.length;

    return Object.entries(typeData).map(([type, data]) => ({
      name: type,
      value: data.count,
      premium: data.totalPremium,
      percentage: totalPolicies > 0 ? (data.count / totalPolicies) * 100 : 0,
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

  const formatPercentage = (value: number) => {
    if (policies.length === 0) return "No policies";
    if (value === 0) return "0%";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.name} className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{item.name}</p>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">
              {formatPercentage(item.percentage)}{" "}
              {policies.length > 0 && "of total"}
            </p>
          </div>
        ))}
      </div>

      <div className="h-80">
        {policies.length > 0 ? (
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
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No policy data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDistributionChart;
