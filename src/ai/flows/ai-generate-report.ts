'use server';
/**
 * @fileOverview An AI agent that generates a strategic pipeline performance report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGenerateReportInputSchema = z.object({
  totalLeads: z.number(),
  conversionRate: z.number(),
  statusBreakdown: z.record(z.number()),
  sourceBreakdown: z.record(z.number()),
});
export type AiGenerateReportInput = z.infer<typeof AiGenerateReportInputSchema>;

const AiGenerateReportOutputSchema = z.object({
  title: z.string().describe("A professional title for the report."),
  summary: z.string().describe("A high-level executive summary of pipeline health."),
  insights: z.array(z.string()).describe("3-4 key data-driven insights about the current sales state."),
  recommendations: z.array(z.string()).describe("3 actionable strategic recommendations."),
});
export type AiGenerateReportOutput = z.infer<typeof AiGenerateReportOutputSchema>;

export async function generateAiReport(input: AiGenerateReportInput): Promise<AiGenerateReportOutput> {
  return aiGenerateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGenerateReportPrompt',
  input: {schema: AiGenerateReportInputSchema},
  output: {schema: AiGenerateReportOutputSchema},
  prompt: `You are a Senior Sales Operations Consultant. Analyze the following CRM performance data and generate a strategic performance report.

Data Snapshot:
- Total Leads: {{totalLeads}}
- Conversion Rate: {{conversionRate}}%
- Status Breakdown: {{#each statusBreakdown}}{{@key}}: {{this}}, {{/each}}
- Lead Sources: {{#each sourceBreakdown}}{{@key}}: {{this}}, {{/each}}

Requirements:
- The summary should be objective and professional.
- Insights should highlight patterns or bottlenecks.
- Recommendations should be highly actionable (e.g., "Increase follow-up frequency on Referral leads").

Tone: Executive, data-driven, and authoritative.`,
});

const aiGenerateReportFlow = ai.defineFlow(
  {
    name: 'aiGenerateReportFlow',
    inputSchema: AiGenerateReportInputSchema,
    outputSchema: AiGenerateReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);