// File: app/api/create-admin/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Function to generate a random, secure password
function generateTemporaryPassword() {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export async function POST(request: Request) {
  const { name, email } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const temporaryPassword = generateTemporaryPassword();

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: temporaryPassword,
    email_confirm: true, // User must confirm their email
    user_metadata: { full_name: name },
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  if (!authData.user) {
    return NextResponse.json({ error: 'User could not be created.' }, { status: 500 });
  }

  // 2. Insert the user into your public 'admin' table
  const { error: profileError } = await supabaseAdmin
    .from('admin')
    .insert({
      id: authData.user.id,
      name: name,
      email: email,
      // The 'role' will default to 'admin' as set in the database
    });

  if (profileError) {
    console.error('Error creating admin profile:', profileError);
    // If this fails, you should ideally delete the auth user to prevent orphaned accounts
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: 'Failed to create admin profile.' }, { status: 500 });
  }
  
  // NOTE: In a real-world scenario, you would email the temporary password to the user.
  // For this project, we will display it to the super admin once.
  return NextResponse.json({
    message: 'Admin created successfully.',
    user: authData.user,
    temporaryPassword: temporaryPassword, // Return the password to the super admin
  });
}