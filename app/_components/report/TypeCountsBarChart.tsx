"use client";

import { Bar, BarChart, Cell, LabelList, XAxis } from "recharts";

type TypeCount = {
  type: string;
  count: number;
};

type TypeCountsBarChartProps = {
  data: TypeCount[];
};

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
          tickMargin={8}
        />
        <Bar dataKey="count" radius={8} barSize={BAR_WIDTH}>
          {data.map((entry, index) => {
            const COLORS = [
              "#BFEFEC",
              "#C5ECF8",
              "#DDE1FF",
              "#E4DAF8",
              "#EDD8F3",
              "#F4D8E9",
            ];
            return (
              <Cell
                // type 값이 unique 라는 가정
                key={entry.type}
                fill={COLORS[index % COLORS.length]}
              />
            );
          })}
          <LabelList
            dataKey="count"
            position="top"
            offset={8}
            className="fill-gray-400"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </div>
  );
}
