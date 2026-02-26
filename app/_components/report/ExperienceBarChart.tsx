"use client";

import {
  TYPE_COUNT_COLORS,
  TYPE_COUNT_LABEL_COLORS,
} from "./TypeCountsBarChart";

export type TagCount = {
  tag: string;
  count: number;
};

type ExperienceBarChartProps = {
  data: TagCount[];
};

export function ExperienceBarChart({ data }: ExperienceBarChartProps) {
  if (!data.length) {
    return (
      <p className="text-sm text-gray-200">
        표시할 해시태그 데이터가 없습니다.
      </p>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  const max = sorted[0]?.count || 1;

  return (
    <div className="flex flex-col gap-2.5 w-61.25">
      {sorted.map((item, index) => {
        const progress = (item.count / max) * 100;
        const color = TYPE_COUNT_COLORS[index % TYPE_COUNT_COLORS.length];
        const labelColor =
          TYPE_COUNT_LABEL_COLORS[index % TYPE_COUNT_LABEL_COLORS.length];

        return (
          <div key={item.tag} className="flex items-center gap-3.5">
            <span className="semibold_16" style={{ color: labelColor }}>
              {item.count}
            </span>
            <div className="flex-1 h-4 rounded-full bg-gray-10 overflow-hidden">
              <div
                className="h-full rounded-full animate-grow-bar"
                style={{
                  width: `${progress}%`,
                  backgroundColor: color,
                  animationDelay: `${index * 100}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
