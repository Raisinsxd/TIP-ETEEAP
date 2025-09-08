import { supabase } from './supabase'
import { updateUserLoginTime } from './database'

export const signIn = async (email, password) => {
  try {
    // First check if user exists in your users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      throw new Error('User not found')
    }

    // For demo purposes, we'll simulate password check
    // In production, you'd want proper password hashing
    if (password === 'admin123') { // Replace with your auth logic
      // Update the login time in your users table
      await updateUserLoginTime(userData.id)
      
      return { user: userData, error: null }
    } else {
      throw new Error('Invalid password')
    }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const signOut = async () => {
  // Clear local session/storage
  return { error: null }
}