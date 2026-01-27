import { Suspense } from 'react';
import { getProjectsServer } from './_apis/projects';
import { HomeClient } from './_components/HomeClient';
import { ProjectList, ProjectListSkeleton } from './_components/ProjectList';

// 프로젝트 목록 서버 컴포넌트 (async)
async function ProjectListServer() {
  const projects = await getProjectsServer().catch((error) => {
    console.error('Failed to fetch projects:', error);
    return [];
  });

  return <ProjectList projects={projects} />;
}

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
