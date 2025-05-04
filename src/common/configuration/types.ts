import { ConfigSchema } from "./configuration-schema";

export type SupabaseConfig = {
  [K in keyof ConfigSchema["supabase"]]: string;
};
