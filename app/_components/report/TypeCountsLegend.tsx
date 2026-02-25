import { TYPE_COUNT_COLORS, type TypeCount } from "./TypeCountsBarChart";

type ChartInfoProps = {
  data: TypeCount[];
};

export function ChartInfo({ data }: ChartInfoProps) {
  if (!data.length) return null;

  return (
    <div className="grid grid-cols-3 gap-y-2">
      {data.slice(0, 6).map((item, index) => (
        <div
          key={`${item.type}-${index}`}
          className="flex items-center gap-1.5"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                TYPE_COUNT_COLORS[index % TYPE_COUNT_COLORS.length],
            }}
          />
          <span className="regular_14 text-gray-200">{item.type}</span>
        </div>
      ))}
    </div>
  );
}

