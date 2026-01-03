import { z } from "zod";

/* ======================
   USER
====================== */
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
});

/* ======================
   TRIP
====================== */
export const createTripSchema = z.object({
  userId: z.string().cuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  coverPhoto: z.string().url().optional(),
});

export const tripIdSchema = z.object({
  tripId: z.string().cuid(),
});

/* ======================
   STOP
====================== */
export const createStopSchema = z.object({
  tripId: z.string().cuid(),
  cityId: z.string().cuid(),
  position: z.number().int().min(0),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

/* ======================
   ACTIVITY
====================== */
export const addActivitySchema = z.object({
  stopId: z.string().cuid(),
  activityId: z.string().cuid(),
  scheduledAt: z.coerce.date().optional(),
  position: z.number().int().optional(),
});

/* ======================
   COST
====================== */
export const addCostSchema = z.object({
  tripId: z.string().cuid().optional(),
  stopId: z.string().cuid().optional(),
  category: z.enum(["TRANSPORT", "STAY", "ACTIVITY", "MEAL", "OTHER"]),
  amount: z.number().positive(),
  currency: z.string().length(3).default("INR"),
  description: z.string().optional(),
});

/* ======================
   CITY
====================== */
export const createCitySchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  slug: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  costIndex: z.number().int().optional(),
  popularity: z.number().int().optional(),
});

/* ======================
   ACTIVITY (MASTER)
====================== */
export const createActivityMasterSchema = z.object({
  cityId: z.string().cuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["SIGHTSEEING", "FOOD", "ADVENTURE", "CULTURE", "TRANSPORT", "OTHER"]),
  avgCost: z.number().positive().optional(),
  durationMin: z.number().int().positive().optional(),
});
