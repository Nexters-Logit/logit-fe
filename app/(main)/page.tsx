import { Suspense } from "react";
import { HomeClient } from "../_components/HomeClient";
import { ProjectListServer } from "../_components/ProjectListServer";
import { ProjectListSkeleton } from "../_components/ProjectListSkeleton";

export default function Home() {
  return (
    <HomeClient
      projectListSlot={
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectListServer />
        </Suspense>
      }
    />
  );
}
