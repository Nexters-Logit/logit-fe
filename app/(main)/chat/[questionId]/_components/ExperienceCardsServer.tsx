import { getExperiencesServer } from '../_apis/chat';
import { ExperienceCards } from './ExperienceCards';

export async function ExperienceCardsServer() {
  const experiences = await getExperiencesServer().catch((error) => {
    console.error('Failed to fetch experiences:', error);
    return [];
  });

  return <ExperienceCards experiences={experiences} />;
}
