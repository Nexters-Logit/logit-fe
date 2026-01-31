import { getMatchedExperiences } from '../../_apis/chat';
import { ExperienceCards } from './ExperienceCards';

interface ExperienceCardsServerProps {
  questionId: string;
}

export async function ExperienceCardsServer({
  questionId,
}: ExperienceCardsServerProps) {
  const matchedExperiences = await getMatchedExperiences(questionId).catch(
    (error) => {
      console.error('Failed to fetch matched experiences:', error);
      return [];
    }
  );

  return <ExperienceCards matchedExperiences={matchedExperiences} />;
}
