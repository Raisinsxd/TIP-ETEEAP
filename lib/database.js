import { supabase, supabaseAdmin } from './supabase'

// Users CRUD operations for your existing schema
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('date_logged_in', { ascending: false })
  return { data, error }
}

export const createUser = async (userData) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{
      ...userData,
      date_logged_in: new Date().toISOString()
    }])
    .select()
  return { data, error }
}

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
  return { data, error }
}

// Get user statistics
export const getUserStats = async () => {
  const { data: totalUsers } = await supabase
    .from('users')
    .select('id', { count: 'exact' })

  const { data: todayLogins } = await supabase
    .from('users')
    .select('id', { count: 'exact' })
    .gte('date_logged_in', new Date().toISOString().split('T')[0])

  const { data: recentLogins } = await supabase
    .from('users')
    .select('id', { count: 'exact' })
    .gte('date_logged_in', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  return {
    totalUsers: totalUsers?.length || 0,
    todayLogins: todayLogins?.length || 0,
    weeklyLogins: recentLogins?.length || 0
  }
}

// Get login activity (based on date_logged_in field)
export const getLoginActivity = async (limit = 50) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('date_logged_in', { ascending: false })
    .limit(limit)
  return { data, error }
}

// Search users
export const searchUsers = async (searchTerm) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .order('date_logged_in', { ascending: false })
  return { data, error }
}

// Update user login time
export const updateUserLoginTime = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .update({ date_logged_in: new Date().toISOString() })
    .eq('id', userId)
    .select()
  return { data, error }
}