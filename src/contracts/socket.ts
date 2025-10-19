import { z } from 'zod';

export type ISocketId = z.infer<typeof SocketId>;
export const SocketId = z.uuid().brand<'SocketId'>();
