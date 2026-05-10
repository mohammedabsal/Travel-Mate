import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required')
});

export const tripSchema = z.object({
  title: z.string().min(2, 'Trip title is required'),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  budgetTarget: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  visibility: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).default('PRIVATE')
}).refine((value) => value.endDate >= value.startDate, {
  message: 'End date must be after the start date',
  path: ['endDate']
});

export const tripStopSchema = z.object({
  tripId: z.string().min(1),
  destinationId: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  region: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  order: z.coerce.number().int().nonnegative(),
  arrivalDate: z.coerce.date().optional(),
  departureDate: z.coerce.date().optional(),
  notes: z.string().optional()
});

export const activitySchema = z.object({
  destinationId: z.string().optional(),
  categoryId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  durationMins: z.coerce.number().min(15),
  estimatedCost: z.coerce.number().min(0).default(0),
  rating: z.coerce.number().min(0).max(5).default(0)
});

export const budgetSchema = z.object({
  tripId: z.string().min(1),
  currency: z.string().default('USD'),
  totalPlanned: z.coerce.number().min(0).default(0),
  totalSpent: z.coerce.number().min(0).default(0),
  dailyAverage: z.coerce.number().min(0).default(0)
});

export const expenseSchema = z.object({
  tripId: z.string().min(1),
  budgetId: z.string().min(1),
  title: z.string().min(2),
  amount: z.coerce.number().min(0),
  category: z.enum(['TRANSPORTATION', 'ACCOMMODATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'OTHER']),
  expenseDate: z.coerce.date(),
  vendor: z.string().optional(),
  notes: z.string().optional()
});

export const checklistSchema = z.object({
  tripId: z.string().min(1),
  title: z.string().min(2).default('Packing checklist')
});

export const checklistItemSchema = z.object({
  checklistId: z.string().min(1),
  tripId: z.string().min(1),
  label: z.string().min(2),
  category: z.string().min(1),
  quantity: z.coerce.number().int().positive().default(1),
  notes: z.string().optional()
});

export const journalEntrySchema = z.object({
  tripId: z.string().min(1),
  tripStopId: z.string().optional(),
  title: z.string().min(2),
  content: z.string().min(1),
  entryDate: z.coerce.date(),
  isPrivate: z.coerce.boolean().default(true)
});

export const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(280).optional(),
  image: z.string().url().optional().or(z.literal('')),
  locale: z.string().default('en'),
  currency: z.string().default('USD'),
  timezone: z.string().default('UTC')
});

export const destinationSearchSchema = z.object({
  query: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12)
});

export const activitySearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  destinationId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12)
});