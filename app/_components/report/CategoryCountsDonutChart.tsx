"use client";

import { Cell, LabelList, Pie, PieChart } from "recharts";
import { TYPE_COUNT_COLORS } from "./TypeCountsBarChart";

export type CategoryCount = {
  category: string;
  count: number;
};

type CategoryCountsDonutChartProps = {
  data: CategoryCount[];
};

export function CategoryCountsDonutChart({
  data,
}: CategoryCountsDonutChartProps) {
  if (!data.length) {
    return (
      <p className="text-sm text-gray-200">
        표시할 카테고리 데이터가 없습니다.
      </p>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="relative w-53 h-45 flex items-center justify-center">
      <PieChart width={185} height={185}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={64}
          outerRadius={88}
          paddingAngle={6}
          cornerRadius={999}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.category}
              fill={TYPE_COUNT_COLORS[index % TYPE_COUNT_COLORS.length]}
            />
          ))}
          <LabelList
            dataKey="count"
            position="inside"
            className="fill-gray-400"
            fontSize={12}
          />
        </Pie>
      </PieChart>
      <div className="absolute flex flex-col items-center">
        <p className="semibold_16 text-gray-400">역량 키워드</p>
        <p className="regular_14 text-gray-200">{total}개 집계</p>
      </div>
    </div>
  );
}
