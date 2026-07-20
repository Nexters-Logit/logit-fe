import { Suspense } from "react";
import { ReportExperienceListServer } from "./_components/ReportExperienceListServer";
import { ReportExperienceListSkeleton } from "./_components/ReportExperienceListSkeleton";
import { ExperienceAnalysisSection } from "./_components/ExperienceAnalysisSection";
import { ReportPageTitle } from "./_components/ReportPageTitle";
import { ReportExperienceButton } from "./_components/ReportExperienceButton";
import { ReportPageGuard } from "./_components/ReportPageGuard";

export default function ReportPage() {
  return (
    <ReportPageGuard>
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
    </ReportPageGuard>
  );
}
