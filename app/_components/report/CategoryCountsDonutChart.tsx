"use client";

import { Cell, LabelList, Pie, PieChart, type LabelProps } from "recharts";
import Image from "next/image";
import {
  TYPE_COUNT_COLORS,
  TYPE_COUNT_LABEL_COLORS,
} from "./TypeCountsBarChart";

export type TagCount = {
  tag: string;
  count: number;
};

type CategoryCountsDonutChartProps = {
  data: TagCount[];
};

function renderDonutLabel(props: LabelProps) {
  const { value, index = 0, viewBox } = props;
  if (value == null || value === false || !viewBox || !("cx" in viewBox)) {
    return null;
  }

  const cx = viewBox.cx ?? 0;
  const cy = viewBox.cy ?? 0;
  const innerRadius = viewBox.innerRadius ?? 0;
  const outerRadius = viewBox.outerRadius ?? 0;
  const startAngle = viewBox.startAngle ?? 0;
  const endAngle = viewBox.endAngle ?? 0;

  const midAngle = (startAngle + endAngle) / 2;
  const RADIAN = Math.PI / 180;
  const radius = (innerRadius + outerRadius) / 2;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = TYPE_COUNT_LABEL_COLORS[index % TYPE_COUNT_LABEL_COLORS.length];

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={color}
      fontSize={12}
      fontWeight={700}
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
}

export function CategoryCountsDonutChart({
  data,
}: CategoryCountsDonutChartProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center gap-7">
        <Image
          src="/icons/experience_empty2.svg"
          alt="경험 등록이 필요해요"
          width={84}
          height={84}
        />
        <p className="medium_15 text-gray-100">경험 등록이 필요해요</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="relative w-53 h-45 flex items-center justify-center pointer-events-none">
      <PieChart width={185} height={185}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={64}
          outerRadius={88}
          paddingAngle={1}
          minAngle={15}
          cornerRadius={999}
          animationBegin={0}
          animationDuration={600}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.tag}
              fill={TYPE_COUNT_COLORS[index % TYPE_COUNT_COLORS.length]}
            />
          ))}
          <LabelList
            dataKey="count"
            position="inside"
            content={renderDonutLabel}
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
