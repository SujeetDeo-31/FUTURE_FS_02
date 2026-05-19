'use server';
/**
 * @fileOverview An AI agent that suggests the next best action for a lead.
 *
 * - aiNextActionSuggestion - A function that handles the AI next action suggestion process.
 * - AiNextActionSuggestionInput - The input type for the aiNextActionSuggestion function.
 * - AiNextActionSuggestionOutput - The return type for the aiNextActionSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiNextActionSuggestionInputSchema = z.object({
  name: z.string().describe('The name of the lead.'),
  email: z.string().optional().describe('The email of the lead.'),
  phone: z.string().optional().describe('The phone number of the lead.'),
  company: z.string().optional().describe('The company of the lead.'),
  source: z.string().describe('The source from which the lead was acquired.'),
  status: z
    .enum([
      'New',
      'Contacted',
      'Qualified',
      'Proposal Sent',
      'Converted',
      'Lost',
    ])
    .describe('The current status of the lead.'),
  priority: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The priority level of the lead.'),
  assignedTo: z
    .string()
    .optional()
    .describe('The user assigned to this lead.'),
  notesHistory: z
    .array(
      z.object({
        timestamp: z.string().describe('Timestamp of the note.'),
        note: z.string().describe('Content of the note.'),
      })
    )
    .describe('A chronological history of notes and interactions with the lead.'),
  followUpDate: z
    .string()
    .optional()
    .describe(
      'The date of the next scheduled follow-up, if any. Format: YYYY-MM-DD.'
    ),
  lastContactedDate: z
    .string()
    .optional()
    .describe('The date when the lead was last contacted. Format: YYYY-MM-DD.'),
  createdAt: z
    .string()
    .describe('The date when the lead was created. Format: YYYY-MM-DD.'),
});

export type AiNextActionSuggestionInput = z.infer<
  typeof AiNextActionSuggestionInputSchema
>;

const AiNextActionSuggestionOutputSchema = z.object({
  suggestedAction: z
    .string()
    .describe('A concise suggestion for the next best action to take.'),
  reasoning: z
    .string()
    .describe('A brief explanation (max 2 sentences) behind the suggested action.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score (0-100) indicating the confidence in the suggestion.'),
  suggestedCommunicationStrategy: z
    .string()
    .optional()
    .describe('Tips on how to communicate effectively with the lead.'),
  suggestedFollowUpDate: z
    .string()
    .optional()
    .describe(
      'A recommended date for the next follow-up. Format: YYYY-MM-DD.'
    ),
});

export type AiNextActionSuggestionOutput = z.infer<
  typeof AiNextActionSuggestionOutputSchema
>;

export async function aiNextActionSuggestion(
  input: AiNextActionSuggestionInput
): Promise<AiNextActionSuggestionOutput> {
  return aiNextActionSuggestionFlow(input);
}

const nextActionSuggestionPrompt = ai.definePrompt({
  name: 'nextActionSuggestionPrompt',
  input: {schema: AiNextActionSuggestionInputSchema},
  output: {schema: AiNextActionSuggestionOutputSchema},
  prompt: `You are an expert CRM assistant. Analyze the lead's information and suggest a highly actionable next move.

Lead Details:
Name: {{{name}}}
Company: {{{company}}}
Status: {{{status}}}
Priority: {{{priority}}}
Interaction History:
{{#each notesHistory}}
- {{{timestamp}}}: {{{note}}}
{{/each}}

Based on this, provide a concise suggested action and a brief reasoning (max 2 sentences). Keep the tone professional and focused on conversion.`,
});

const aiNextActionSuggestionFlow = ai.defineFlow(
  {
    name: 'aiNextActionSuggestionFlow',
    inputSchema: AiNextActionSuggestionInputSchema,
    outputSchema: AiNextActionSuggestionOutputSchema,
  },
  async input => {
    const {output} = await nextActionSuggestionPrompt(input);
    return output!;
  }
);
