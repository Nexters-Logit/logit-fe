import { getProjects } from "@/app/_actions/projects";
import { ProjectList } from "./ProjectList";
export async function ProjectListServer() {
  const projects = await getProjects({ skip: 0, limit: 4 }).catch((error) => {
    console.error("Failed to fetch projects:", error);
    return [];
  });

  return <ProjectList projects={projects} />;
}
