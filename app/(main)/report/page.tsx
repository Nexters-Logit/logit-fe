import { Suspense } from "react";
import Link from "next/link";
import { ReportExperienceListServer } from "../../_components/report/ReportExperienceListServer";
import { ReportExperienceListSkeleton } from "../../_components/report/ReportExperienceListSkeleton";
import { ExperienceAnalysisSection } from "../../_components/report/ExperienceAnalysisSection";
import { ReportPageTitle } from "../../_components/report/ReportPageTitle";

export default function ReportPage() {
  return (
    <main className="w-full mx-auto p-10 pb-25 flex-1 overflow-y-auto scrollbar-hide">
      <div className="w-276 mx-auto">
        <ReportPageTitle />

        <ExperienceAnalysisSection />

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-title-2-2 text-gray-400">경험 목록</h2>
            <Link
              href="/experience/new"
              className="inline-flex items-center justify-center px-5 h-11 rounded-3.5 bg-primary-100 text-body-5-2 text-white hover:bg-primary-80 transition-colors"
            >
              경험 등록
            </Link>
          </div>
          <Suspense fallback={<ReportExperienceListSkeleton />}>
            <ReportExperienceListServer />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
