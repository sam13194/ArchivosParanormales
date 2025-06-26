export interface Story {
  id: number;
  title: string;
  imageUrl: string;
  imageHint: string;
  location: string;
  impact: number;
  duration: number;
  tags: string[];
  credibility: number;
  isBasedOnRealTestimony: boolean;
  summary: string;
  audioUrl: string;
  fullText: string;
  witnesses: { name: string; role: string }[];
  eventDate: string;
  relatedStories: number[];
}
