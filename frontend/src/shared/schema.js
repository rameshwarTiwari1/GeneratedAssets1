import { z } from "zod";
// Zod schemas for validation
export const insertUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    profilePhoto: z.string().optional(),
    firebaseUid: z.string().optional(),
});
export const insertIndexSchema = z.object({
    prompt: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    userId: z.string().optional(),
    isPublic: z.boolean().default(false),
    totalValue: z.number().default(0),
    performance1d: z.number().default(0),
    performance7d: z.number().default(0),
    performance30d: z.number().default(0),
    performance1y: z.number().default(0),
    benchmarkSp500: z.number().default(0),
    benchmarkNasdaq: z.number().default(0),
});
export const insertStockSchema = z.object({
    indexId: z.union([z.string(), z.any()]), // ObjectId
    symbol: z.string().min(1),
    name: z.string().min(1),
    price: z.number(),
    sector: z.string().optional(),
    marketCap: z.number().optional(),
    weight: z.number().default(1),
    change1d: z.number().default(0),
    changePercent1d: z.number().default(0),
});
export const insertHistoricalDataSchema = z.object({
    indexId: z.union([z.string(), z.any()]), // ObjectId
    date: z.date(),
    value: z.number(),
    sp500Value: z.number(),
    nasdaqValue: z.number(),
});
