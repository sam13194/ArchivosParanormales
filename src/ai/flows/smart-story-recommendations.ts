// src/ai/flows/smart-story-recommendations.ts
'use server';

/**
 * @fileOverview Implements smart story recommendations based on user viewing history and interests.
 *
 * - recommendStories - A function that recommends stories based on user input.
 * - RecommendStoriesInput - The input type for the recommendStories function.
 * - RecommendStoriesOutput - The return type for the recommendStories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendStoriesInputSchema = z.object({
  viewingHistory: z.array(z.string()).describe('An array of story IDs representing the user\'s viewing history.'),
  interests: z.string().describe('A description of the user\'s interests related to paranormal stories.'),
  numberOfRecommendations: z.number().default(5).describe('The number of story recommendations to return.'),
});
export type RecommendStoriesInput = z.infer<typeof RecommendStoriesInputSchema>;

const RecommendStoriesOutputSchema = z.array(z.object({
  storyId: z.string().describe('The ID of the recommended story.'),
  title: z.string().describe('The title of the recommended story.'),
  reason: z.string().describe('The reason why this story is recommended to the user.'),
}));
export type RecommendStoriesOutput = z.infer<typeof RecommendStoriesOutputSchema>;

export async function recommendStories(input: RecommendStoriesInput): Promise<RecommendStoriesOutput> {
  return recommendStoriesFlow(input);
}

const recommendStoriesPrompt = ai.definePrompt({
  name: 'recommendStoriesPrompt',
  input: {schema: RecommendStoriesInputSchema},
  output: {schema: RecommendStoriesOutputSchema},
  prompt: `You are an AI expert in recommending paranormal stories to users based on their viewing history and interests.

  Given the user's viewing history and interests, recommend {{numberOfRecommendations}} stories that the user might enjoy.
  Explain the reason for each recommendation.

  User Viewing History: {{viewingHistory}}
  User Interests: {{interests}}

  Format your response as a JSON array of story objects, each with a storyId, title, and reason for recommendation.
  `,
});

const recommendStoriesFlow = ai.defineFlow(
  {
    name: 'recommendStoriesFlow',
    inputSchema: RecommendStoriesInputSchema,
    outputSchema: RecommendStoriesOutputSchema,
  },
  async input => {
    const {output} = await recommendStoriesPrompt(input);
    return output!;
  }
);
