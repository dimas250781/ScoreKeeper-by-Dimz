'use server';

import { remiRuleSuggestion, RemiRuleSuggestionInput, RemiRuleSuggestionOutput } from '@/ai/flows/remi-rule-suggestion';
import { z } from 'zod';

const RuleSuggestionSchema = z.object({
  ruleInquiry: z.string().min(10, { message: 'Please describe your rule question in more detail.' }),
});

export async function getRuleSuggestion(
  prevState: any,
  formData: FormData
): Promise<{ message: string | null, suggestion: string | null, error: string | null }> {
  const validatedFields = RuleSuggestionSchema.safeParse({
    ruleInquiry: formData.get('ruleInquiry'),
  });

  if (!validatedFields.success) {
    return {
      message: null,
      suggestion: null,
      error: validatedFields.error.flatten().fieldErrors.ruleInquiry?.[0] || 'Invalid input.',
    };
  }

  try {
    const input: RemiRuleSuggestionInput = {
      ruleInquiry: validatedFields.data.ruleInquiry,
    };
    const result: RemiRuleSuggestionOutput = await remiRuleSuggestion(input);
    return {
      message: 'Suggestion received.',
      suggestion: result.ruleSuggestion,
      error: null,
    };
  } catch (e) {
    return {
      message: null,
      suggestion: null,
      error: 'Failed to get suggestion from AI. Please try again.',
    };
  }
}
