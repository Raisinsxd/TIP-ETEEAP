// app/api/applicants/route.ts

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  
  // 1. GET the cookie store and AWAIT it
  const cookieStore = await cookies(); // ✅ THIS IS THE FIX
  
  // 2. PASS the cookie store to your helper function
  const supabase = createSupabaseServerClient(cookieStore);

  // 3. Now the rest of your code will work
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('Error listing users:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(users);
}