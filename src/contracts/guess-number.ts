import { z } from 'zod';

export type IGuessNumber = z.infer<typeof GuessNumber>;
export const GuessNumber = z.number().min(1).max(100).brand<'GuessNumber'>();
