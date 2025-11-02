// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// 1. This function ACCEPTS the cookieStore as an argument
export function createSupabaseServerClient(
  cookieStore: ReadonlyRequestCookies
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the Service Role Key
    {
      cookies: {
        get(name: string) {
          // 2. It uses the PASSED-IN cookieStore
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // 2. It uses the PASSED-IN cookieStore
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can fail in read-only contexts, but is needed for the type
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // 2. It uses the PASSED-IN cookieStore
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // This can fail in read-only contexts
          }
        },
      },
    }
  );
}