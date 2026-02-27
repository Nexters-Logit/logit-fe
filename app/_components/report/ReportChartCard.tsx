import Image from "next/image";
import type { TypeCount } from "./TypeCountsBarChart";
import { ChartInfo } from "./TypeCountsLegend";

type ReportChartCardProps = {
  iconSrc: string;
  iconAlt: string;
  emptyTitle: string;
  title: string;
  description: string;
  children: React.ReactNode;
  //TODO: 데이터 타입 정의
  data?: TypeCount[];
};

export function ReportChartCard({
  iconSrc,
  iconAlt,
  title,
  emptyTitle,
  description,
  children,
  data,
}: ReportChartCardProps) {
  const hasNonZeroData =
    Array.isArray(data) && data.some((item) => item.count > 0);

  return (
    <div className="flex flex-col shrink-0 w-[343px] h-[479px] rounded-7.5 bg-white p-5">
      {hasNonZeroData ? (
        <div className="flex flex-col">
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={34}
            height={34}
            className="mb-1.5"
          />
          <>
            <h3 className="semibold_22 text-gray-400 mb-1.5 break-keep">
              {title}
            </h3>
            <p className="regular_16 text-gray-200 break-keep h-[72px]">
              {description}
            </p>
          </>
        </div>
      ) : (
        <div className="flex gap-3.5">
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={34}
            height={34}
            className="mb-1.5"
          />
          <>
            <h3 className="semibold_22 text-gray-200 break-keep">
              {emptyTitle}
            </h3>
          </>
        </div>
      )}
      <div className="flex justify-center items-center mb-14 mt-1">
        {children}
      </div>
      {hasNonZeroData && <ChartInfo data={data!} />}
    </div>
  );
}
