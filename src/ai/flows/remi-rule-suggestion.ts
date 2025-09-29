'use server';

/**
 * @fileOverview An AI agent for providing Remi rule suggestions.
 *
 * - remiRuleSuggestion - A function that provides suggestions on scoring edge cases in Remi.
 * - RemiRuleSuggestionInput - The input type for the remiRuleSuggestion function.
 * - RemiRuleSuggestionOutput - The return type for the remiRuleSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemiRuleSuggestionInputSchema = z.object({
  ruleInquiry: z
    .string()
    .describe('The specific rule or scoring edge case the user is inquiring about in Remi.'),
});
export type RemiRuleSuggestionInput = z.infer<typeof RemiRuleSuggestionInputSchema>;

const RemiRuleSuggestionOutputSchema = z.object({
  ruleSuggestion: z
    .string()
    .describe('The AI-generated suggestion for the Remi rule or scoring edge case.'),
});
export type RemiRuleSuggestionOutput = z.infer<typeof RemiRuleSuggestionOutputSchema>;

export async function remiRuleSuggestion(input: RemiRuleSuggestionInput): Promise<RemiRuleSuggestionOutput> {
  return remiRuleSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'remiRuleSuggestionPrompt',
  input: {schema: RemiRuleSuggestionInputSchema},
  output: {schema: RemiRuleSuggestionOutputSchema},
  prompt: `You are an expert Remi rule advisor. A user will ask you about a specific rule or scoring edge case in Remi, and you will provide a helpful suggestion based on the official rules and common interpretations of the rules.

  Use chain-of-thought reasoning to handle ambiguity in the prompt.  First, clarify your understanding of the user's question.  Then, reason step by step how to answer the question.  Finally, output the answer.

  User Inquiry: {{{ruleInquiry}}}`,
});

const remiRuleSuggestionFlow = ai.defineFlow(
  {
    name: 'remiRuleSuggestionFlow',
    inputSchema: RemiRuleSuggestionInputSchema,
    outputSchema: RemiRuleSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
