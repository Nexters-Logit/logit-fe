import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/libs/auth";
import { getProjects } from "@/app/_actions/projects";
import { ProjectList } from "./ProjectList";

export async function ProjectListServer() {
  const store = await cookies();
  const hasToken = !!store.get(ACCESS_TOKEN_COOKIE)?.value;

  const projects = hasToken
    ? await getProjects({ skip: 0, limit: 10 }).catch((error) => {
        console.error("Failed to fetch projects:", error);
        return [];
      })
    : [];

  return <ProjectList projects={projects} hasToken={hasToken} />;
}
