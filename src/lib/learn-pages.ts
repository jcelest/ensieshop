export interface LearnPage {
  slug: string;
  title: string;
  description: string;
  body: string[];
  published: boolean;
  updatedAt?: string;
}

export const learnPages: LearnPage[] = [];

export function getPublishedLearnPages(): LearnPage[] {
  return learnPages.filter((page) => page.published);
}

export function getLearnPage(slug: string): LearnPage | undefined {
  return getPublishedLearnPages().find((page) => page.slug === slug);
}
