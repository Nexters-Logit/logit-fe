import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "@/app/_actions/experiences";

export function useExperienceCounts() {
  return useQuery({
    queryKey: ["experienceCounts"],
    queryFn: async () => {
      const experiences = await getExperiences();
      return experiences.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    },
  });
}
