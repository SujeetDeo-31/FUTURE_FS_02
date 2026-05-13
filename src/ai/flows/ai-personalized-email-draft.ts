'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized email drafts for leads.
 *
 * - aiPersonalizedEmailDraft - A function that generates a personalized email draft.
 * - AiPersonalizedEmailDraftInput - The input type for the aiPersonalizedEmailDraft function.
 * - AiPersonalizedEmailDraftOutput - The return type for the aiPersonalizedEmailDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPersonalizedEmailDraftInputSchema = z.object({
  leadName: z.string().describe("The lead's full name."),
  leadEmail: z.string().email().describe("The lead's email address."),
  leadCompany: z.string().describe("The lead's company."),
  leadSource: z.string().describe('How the lead was acquired (e.g., website, referral, event).'),
  leadStatus: z
    .enum(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'])
    .describe('The current status of the lead.'),
  leadNotes: z.string().describe('A summary of notes related to the lead.'),
  recentInteractionsSummary: z
    .string()
    .describe('A summary of recent interactions and communication history with the lead.'),
  callToAction: z.string().describe('The specific action you want the lead to take.'),
});
export type AiPersonalizedEmailDraftInput = z.infer<typeof AiPersonalizedEmailDraftInputSchema>;

const AiPersonalizedEmailDraftOutputSchema = z.object({
  subject: z.string().describe('The subject line of the personalized email.'),
  body: z.string().describe('The body content of the personalized email.'),
});
export type AiPersonalizedEmailDraftOutput = z.infer<typeof AiPersonalizedEmailDraftOutputSchema>;

export async function aiPersonalizedEmailDraft(
  input: AiPersonalizedEmailDraftInput
): Promise<AiPersonalizedEmailDraftOutput> {
  return aiPersonalizedEmailDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEmailDraftPrompt',
  input: {schema: AiPersonalizedEmailDraftInputSchema},
  output: {schema: AiPersonalizedEmailDraftOutputSchema},
  prompt: `You are an AI assistant designed to draft personalized follow-up emails for sales leads.
Your goal is to create a professional, engaging, and highly personalized email that encourages the lead to take a specific action.

Use the provided lead information, recent interaction summary, and desired call to action to craft a compelling email.

Lead Details:
- Name: {{{leadName}}}
- Company: {{{leadCompany}}}
- Email: {{{leadEmail}}}
- Source: {{{leadSource}}}
- Status: {{{leadStatus}}}
- Notes: {{{leadNotes}}}

Recent Interactions Summary:
{{{recentInteractionsSummary}}}

Desired Call to Action:
{{{callToAction}}}

---

Based on the above information, generate a subject line and the body of a personalized email draft. The tone should be professional and persuasive. Ensure the email clearly states the call to action.

Subject: `,
});

const aiPersonalizedEmailDraftFlow = ai.defineFlow(
  {
    name: 'aiPersonalizedEmailDraftFlow',
    inputSchema: AiPersonalizedEmailDraftInputSchema,
    outputSchema: AiPersonalizedEmailDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
