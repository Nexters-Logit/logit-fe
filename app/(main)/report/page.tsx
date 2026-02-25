import { Suspense } from "react";
import { ReportExperienceListServer } from "../../_components/report/ReportExperienceListServer";
import { ReportExperienceListSkeleton } from "../../_components/report/ReportExperienceListSkeleton";
import { ExperienceAnalysisSection } from "../../_components/report/ExperienceAnalysisSection";
import { ReportPageTitle } from "../../_components/report/ReportPageTitle";
import { ReportExperienceButton } from "../../_components/report/ReportExperienceButton";

export default function ReportPage() {
  return (
    <main className="w-full mx-auto p-10 pb-25 flex-1 overflow-y-auto scrollbar-hide">
      <div className="w-276 mx-auto">
        <ReportPageTitle />

        <ExperienceAnalysisSection />

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-title-2-2 text-gray-400">경험 목록</h2>
            <ReportExperienceButton />
          </div>
          <Suspense fallback={<ReportExperienceListSkeleton />}>
            <ReportExperienceListServer />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
