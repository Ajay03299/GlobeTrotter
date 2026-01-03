import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const TripCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budgetTotal: z.number().int().nonnegative().optional(),
  currency: z.string().optional(),
  stayPerNightDefault: z.number().int().positive().optional(),
  mealsPerDayDefault: z.number().int().positive().optional(),
  transportPerLeg: z.number().int().positive().optional(),
});

export const StopCreateSchema = z.object({
  cityId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const StopActivityAddSchema = z.object({
  activityId: z.string().min(1),
  dayDate: z.string().datetime(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().optional(),
  overrideCost: z.number().int().nonnegative().optional(),
});
