import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/libs/auth";
import { getExperiences } from "@/app/_actions/experiences";
import { ReportExperienceList } from "./report/ReportExperienceList";

export async function ReportExperienceListServer() {
  const store = await cookies();
  const hasToken = !!store.get(ACCESS_TOKEN_COOKIE)?.value;

  const experiences = hasToken
    ? await getExperiences().catch((error) => {
        console.error("Failed to fetch experiences:", error);
        return [];
      })
    : [];

  return <ReportExperienceList experiences={experiences} hasToken={hasToken} />;
}
