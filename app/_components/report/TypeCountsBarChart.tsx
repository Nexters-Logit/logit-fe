"use client";

import { Bar, BarChart, Cell, LabelList, XAxis } from "recharts";

export type TypeCount =
  | { count: number; type: string; category?: never; tag?: never }
  | { count: number; category: string; type?: never; tag?: never }
  | { count: number; tag: string; type?: never; category?: never };

export type TypeCountsBarChartProps = {
  data: TypeCount[];
};

export const TYPE_COUNT_COLORS = [
  "#BFEFEC",
  "#C5ECF8",
  "#DDE1FF",
  "#E4DAF8",
  "#F8DAEC",
  "#FAE8FF",
];

export const TYPE_COUNT_LABEL_COLORS = [
  "#34AD62",
  "#409AB6",
  "#8160C4",
  "#6A77D7",
  "#B84B8C",
  "#DBA3C5",
];

type CountLabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string | null | boolean;
  index?: number;
};

function renderCountLabel(props: CountLabelProps) {
  const { x, y, width, height, value, index = 0 } = props;
  if (
    x == null ||
    y == null ||
    width == null ||
    height == null ||
    value == null ||
    value === false
  ) {
    return null;
  }

  const color = TYPE_COUNT_LABEL_COLORS[index % TYPE_COUNT_LABEL_COLORS.length];

  const centerX = Number(x) + Number(width) / 2;
  // 막대 상단에서 약간 위로 올려서 표시
  const topY = Number(y) - 6;

  return (
    <text
      x={centerX}
      y={topY}
      textAnchor="middle"
      fill={color}
      fontSize={12}
      fontWeight={700}
      dominantBaseline="alphabetic"
    >
      {value}
    </text>
  );
}

export function TypeCountsBarChart({ data }: TypeCountsBarChartProps) {
  if (!data.length) {
    return (
      <p className="text-sm text-gray-200">
        표시할 경험 유형 데이터가 없습니다.
      </p>
    );
  }

  const BAR_WIDTH = 20;
  const BAR_GAP = 18;

  return (
    <div className="w-53 h-45 flex justify-center items-center">
      <BarChart
        width={212}
        height={180}
        data={data}
        margin={{
          top: 16,
          left: 8,
          right: 8,
        }}
        barCategoryGap={BAR_GAP}
      >
        <XAxis
          dataKey="type"
          tickLine={false}
          axisLine={false}
          tick={false}
        />
        <Bar dataKey="count" radius={8} barSize={BAR_WIDTH}>
          {data.map((entry, index) => (
            <Cell
              // type 값이 unique 라는 가정
              key={entry.type}
              fill={TYPE_COUNT_COLORS[index % TYPE_COUNT_COLORS.length]}
            />
          ))}
          <LabelList
            dataKey="count"
            position="top"
            offset={8}
            content={renderCountLabel}
          />
        </Bar>
      </BarChart>
    </div>
  );
}
