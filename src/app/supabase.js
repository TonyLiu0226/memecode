// Centralized Supabase query helpers. Pass a Supabase client (server or client).

export async function getAuthUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getLcUsernameById(supabase, id) {
  const { data, error } = await supabase
    .from('lc_usernames')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data || null
}

export async function upsertLcUsernameWithPrefs(supabase, payload) {
  // payload: { id, lc_session, csrftoken, lc_username, difficulties?, meme_preferences? }
  const { data, error } = await supabase
    .from('lc_usernames')
    .upsert(payload)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getUserDataById(supabase, id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

