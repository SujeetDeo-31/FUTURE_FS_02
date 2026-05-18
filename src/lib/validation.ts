import { z } from 'zod';

const phoneRegex = /^[0-9+\-() ]*$/;

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: 'Invalid phone number. Letters are not allowed.',
    }),
  company: z.string().optional(),
  source: z.string().min(1, 'Source is required'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost']),
  priority: z.enum(['Low', 'Medium', 'High']),
  followUpDate: z.string().optional().nullable(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Note content cannot be empty'),
  authorName: z.string().optional(),
});
