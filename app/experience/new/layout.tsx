import { Suspense } from "react";
import { HomeClient } from "@/app/_components/HomeClient";
import { ProjectListServer } from "@/app/_components/ProjectListServer";
import { ProjectListSkeleton } from "@/app/_components/ProjectListSkeleton";

export default function ExperienceNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeClient
        projectListSlot={
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectListServer />
          </Suspense>
        }
      />
      {children}
    </>
  );
}
