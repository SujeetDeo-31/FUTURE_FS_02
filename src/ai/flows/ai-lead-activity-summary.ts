'use server';
/**
 * @fileOverview An AI agent that summarizes a lead's activity history.
 *
 * - summarizeLeadActivity - A function that handles the lead activity summary process.
 * - AiLeadActivitySummaryInput - The input type for the summarizeLeadActivity function.
 * - AiLeadActivitySummaryOutput - The return type for the summarizeLeadActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiLeadActivitySummaryInputSchema = z.object({
  leadName: z.string().describe("The name of the lead."),
  notes: z.array(z.object({
    timestamp: z.string().describe("The timestamp of the note (ISO string)."),
    content: z.string().describe("The content of the note."),
  })).describe("A list of notes added to the lead."),
  statusHistory: z.array(z.object({
    timestamp: z.string().describe("The timestamp of the status change (ISO string)."),
    oldStatus: z.string().describe("The previous status of the lead."),
    newStatus: z.string().describe("The new status of the lead."),
  })).describe("A list of status changes for the lead."),
  followUpHistory: z.array(z.object({
    timestamp: z.string().describe("The timestamp of the follow-up (ISO string)."),
    action: z.string().describe("The action taken for the follow-up."),
    outcome: z.string().describe("The outcome or result of the follow-up."),
  })).describe("A list of follow-up activities for the lead."),
});
export type AiLeadActivitySummaryInput = z.infer<typeof AiLeadActivitySummaryInputSchema>;

// Output Schema
const AiLeadActivitySummaryOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the lead's activity history."),
});
export type AiLeadActivitySummaryOutput = z.infer<typeof AiLeadActivitySummaryOutputSchema>;

// Wrapper function
export async function summarizeLeadActivity(input: AiLeadActivitySummaryInput): Promise<AiLeadActivitySummaryOutput> {
  return aiLeadActivitySummaryFlow(input);
}

// Prompt definition
const prompt = ai.definePrompt({
  name: 'aiLeadActivitySummaryPrompt',
  input: {schema: AiLeadActivitySummaryInputSchema},
  output: {schema: AiLeadActivitySummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing the activity history for a lead named "{{leadName}}".

Review the provided notes, status changes, and follow-up history. Generate a highly concise, 2-3 sentence executive summary focusing on the current state and most critical interaction.

---
Lead Name: {{leadName}}

Notes History:
{{#each notes}}
- [{{this.timestamp}}] Note: {{{this.content}}}
{{else}}
(No notes available)
{{/each}}

Status Change History:
{{#each statusHistory}}
- [{{this.timestamp}}] Status changed from '{{this.oldStatus}}' to '{{this.newStatus}}'
{{else}}
(No status changes recorded)
{{/each}}

Follow-up History:
{{#each followUpHistory}}
- [{{this.timestamp}}] Action: {{{this.action}}} (Outcome: {{{this.outcome}}})
{{else}}
(No follow-up history)
{{/each}}
---

Summary:`,
});

// Flow definition
const aiLeadActivitySummaryFlow = ai.defineFlow(
  {
    name: 'aiLeadActivitySummaryFlow',
    inputSchema: AiLeadActivitySummaryInputSchema,
    outputSchema: AiLeadActivitySummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
