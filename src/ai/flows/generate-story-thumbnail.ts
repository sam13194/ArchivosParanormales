'use server';

/**
 * @fileOverview An AI agent for generating thumbnail images for paranormal stories.
 *
 * - generateStoryThumbnail - A function that generates a thumbnail image for a story.
 * - GenerateStoryThumbnailInput - The input type for the generateStoryThumbnail function.
 * - GenerateStoryThumbnailOutput - The return type for the generateStoryThumbnail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryThumbnailInputSchema = z.object({
  storyTitle: z.string().describe('The title of the paranormal story.'),
  storyKeywords: z
    .string()
    .describe(
      'Keywords associated with the story, comma separated, that can be used to guide the image generation.'
    ),
});
export type GenerateStoryThumbnailInput = z.infer<typeof GenerateStoryThumbnailInputSchema>;

const GenerateStoryThumbnailOutputSchema = z.object({
  thumbnailDataUri: z
    .string()
    .describe(
      'The generated thumbnail image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep
    ),
});
export type GenerateStoryThumbnailOutput = z.infer<typeof GenerateStoryThumbnailOutputSchema>;

export async function generateStoryThumbnail(
  input: GenerateStoryThumbnailInput
): Promise<GenerateStoryThumbnailOutput> {
  return generateStoryThumbnailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryThumbnailPrompt',
  input: {schema: GenerateStoryThumbnailInputSchema},
  output: {schema: GenerateStoryThumbnailOutputSchema},
  prompt: `You are an AI that generates thumbnail images for paranormal stories.

  Based on the story title and keywords, generate a visually striking and thematically appropriate thumbnail image.

  Story Title: {{{storyTitle}}}
  Keywords: {{{storyKeywords}}}

  Output the thumbnail as a data URI.
  `,
});

const generateStoryThumbnailFlow = ai.defineFlow(
  {
    name: 'generateStoryThumbnailFlow',
    inputSchema: GenerateStoryThumbnailInputSchema,
    outputSchema: GenerateStoryThumbnailOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a thumbnail image for a paranormal story titled \"${input.storyTitle}\". Keywords: ${input.storyKeywords}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No media returned from image generation.');
    }

    return {thumbnailDataUri: media.url!};
  }
);
