"use client";

import Image from "next/image";
import {
  TYPE_COUNT_COLORS,
  TYPE_COUNT_LABEL_COLORS,
  type TypeCount,
} from "./TypeCountsBarChart";

type ExperienceBarChartProps = {
  /** type_counts, category_counts, tag_counts 모두 허용 */
  data: TypeCount[];
};

export function ExperienceBarChart({ data }: ExperienceBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (!data.length || total === 0) {
    return (
      <div className="flex flex-col items-center gap-7 mt-30">
        <Image
          src="/icons/experience_empty3.svg"
          alt="경험 등록이 필요해요"
          width={84}
          height={84}
        />
        <p className="medium_15 text-gray-100">경험 등록이 필요해요</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  const max = sorted[0]?.count || 1;

  return (
    <div className="flex flex-col gap-2.5 w-61.25 min-h-[180px]">
      {sorted.map((item, index) => {
        const progress = (item.count / max) * 100;
        const color = TYPE_COUNT_COLORS[index % TYPE_COUNT_COLORS.length];
        const labelColor =
          TYPE_COUNT_LABEL_COLORS[index % TYPE_COUNT_LABEL_COLORS.length];

        const key =
          ("tag" in item && item.tag) ||
          ("type" in item && item.type) ||
          ("category" in item && item.category) ||
          String(index);

        return (
          <div key={key} className="flex items-center gap-3.5">
            <span className="semibold_16" style={{ color: labelColor }}>
              {item.count}
            </span>
            <div className="flex-1 h-4 rounded-full bg-gray-20 overflow-hidden">
              <div
                className="h-full rounded-full animate-grow-bar"
                style={{
                  // count가 작아도 최소 10px은 보이도록 보장
                  width: `max(${progress}%, 10px)`,
                  backgroundColor: color,
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "600ms",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
