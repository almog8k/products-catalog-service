import z from "zod";

// Status enum
export const ApartmentStatusSchema = z.enum(["available", "reserved", "sold"]);

// Main Apartment schema
export const ApartmentSchema = z.object({
  id: z.string().uuid(),
  model: z.string().max(10),
  building: z.string().max(10),
  plot: z.number().int(),
  floor: z.number().int(),
  apartmentNum: z.number().int(),
  rooms: z.number().int(),
  area: z.number().min(0),
  totalArea: z.number().min(0).optional(),
  balcony: z.number().min(0),
  storage: z.number().min(0),
  storageNum: z.number().int(),
  parkingSpots: z.number().int().min(0),
  price: z.number().min(0),
  blueprintFilename: z.string().max(255),
  blueprintUrl: z.string().max(500).url().optional(),
  blueprintBucketPath: z.string().max(500),
  status: ApartmentStatusSchema,
  isActive: z.boolean(),
  notes: z.string().optional(),
  estimatedRentMonthly: z.number().min(0).optional(),
  apartmentScore: z.number().min(0).max(100).optional(),
  pricePerSqm: z.number().min(0).optional(),
  estimatedYieldAnnual: z.number().min(0).max(100).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Apartment = z.infer<typeof ApartmentSchema>;

// New Apartment schema (for creation)
export const newApartmentSchema = ApartmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalArea: true,
  pricePerSqm: true,
  estimatedYieldAnnual: true,
});

export type NewApartment = z.infer<typeof newApartmentSchema>;

// Update Apartment schema
export const updateApartmentSchema = newApartmentSchema.partial().strict();

export type UpdateApartment = z.infer<typeof updateApartmentSchema>;

// Helper to transform string to number
const toNumber = z.string().transform(Number);

// Helper to transform string to boolean
const toBoolean = z.string().transform((val) => val === "true");

// Filter query schema
export const apartmentFilterQuerySchema = z.object({
  // Exact matches
  model: z.string().optional(),
  building: z.string().optional(),
  status: ApartmentStatusSchema.optional(),

  // Ranges
  minPlot: toNumber.optional(),
  maxPlot: toNumber.optional(),
  minFloor: toNumber.optional(),
  maxFloor: toNumber.optional(),
  minRooms: toNumber.optional(),
  maxRooms: toNumber.optional(),
  minArea: toNumber.optional(),
  maxArea: toNumber.optional(),
  minPrice: toNumber.optional(),
  maxPrice: toNumber.optional(),
  minParkingSpots: toNumber.optional(),
  maxParkingSpots: toNumber.optional(),

  // Booleans
  isActive: toBoolean.optional(),

  // Sorting & Pagination
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: toNumber.optional(),
  offset: toNumber.optional(),
});

export type ApartmentFilterQuery = z.infer<typeof apartmentFilterQuerySchema>;

// Search query schema (alias for filter query)
export const apartmentSearchQuerySchema = apartmentFilterQuerySchema;

export type ApartmentSearchQuery = z.infer<typeof apartmentSearchQuerySchema>;
