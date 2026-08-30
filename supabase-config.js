// Supabase Configuration
// 1. Register at https://supabase.com
// 2. Create a new project
// 3. Copy your URL and Anon Key below
// 4. Run the SQL from supabase-schema.sql in the SQL Editor

const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'

let supabaseClient = null

function initSupabase() {
  if (typeof supabase !== 'undefined' && !supabaseClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabaseClient
}

// ========== AUTH ==========
async function sbLogin(email, password) {
  const sb = initSupabase()
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
  localStorage.setItem('sb_session', JSON.stringify(data.session))
  return data
}

async function sbRegister(email, password, username) {
  const sb = initSupabase()
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { username } }
  })
  if (error) throw error
  return data
}

async function sbLogout() {
  const sb = initSupabase()
  await sb.auth.signOut()
  localStorage.removeItem('sb_session')
  window.location.href = '/'
}

function sbGetUser() {
  const sb = initSupabase()
  return sb.auth.getUser()
}

// ========== PROFILES ==========
async function sbGetProfile(userId) {
  const sb = initSupabase()
  const { data } = await sb.from('profiles').select('*').eq('id', userId).single()
  return data
}

async function sbUpdateProfile(userId, updates) {
  const sb = initSupabase()
  const { data, error } = await sb.from('profiles').update(updates).eq('id', userId)
  if (error) throw error
  return data
}

// ========== FORUM ==========
async function sbGetPosts(limit = 20, offset = 0, sort = 'latest') {
  const sb = initSupabase()
  const orderCol = sort === 'popular' ? 'views' : 'created_at'
  const { data, count } = await sb
    .from('forum_posts')
    .select('*, profiles(username, reputation), votes:votes(count), forum_comments(count)', { count: 'exact' })
    .order(orderCol, { ascending: false })
    .range(offset, offset + limit - 1)
  return { posts: data || [], total: count || 0 }
}

async function sbSearchPosts(query) {
  const sb = initSupabase()
  const { data } = await sb
    .from('forum_posts')
    .select('*, profiles(username, reputation), votes:votes(count), forum_comments(count)')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
  return data || []
}

async function sbCreatePost(title, content, tags, authorId) {
  const sb = initSupabase()
  const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
  const { data, error } = await sb.from('forum_posts').insert({
    title, content, author_id: authorId, tags: tagArray
  }).select().single()
  if (error) throw error
  return data
}

async function sbGetPost(id) {
  const sb = initSupabase()
  const { data } = await sb
    .from('forum_posts')
    .select('*, profiles(username, reputation, role, avatar_url)')
    .eq('id', id)
    .single()
  if (data) {
    await sb.from('forum_posts').update({ views: (data.views || 0) + 1 }).eq('id', id)
  }
  return data
}

async function sbGetComments(postId) {
  const sb = initSupabase()
  const { data } = await sb
    .from('forum_comments')
    .select('*, profiles(username, reputation)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return data || []
}

async function sbCreateComment(postId, content, authorId) {
  const sb = initSupabase()
  const { data, error } = await sb.from('forum_comments').insert({
    post_id: postId, content, author_id: authorId
  }).select().single()
  if (error) throw error
  return data
}

async function sbDeletePost(postId) {
  const sb = initSupabase()
  await sb.from('forum_posts').delete().eq('id', postId)
}

// ========== VOTES ==========
async function sbVote(postId, userId, value) {
  const sb = initSupabase()
  const { data: existing } = await sb.from('votes')
    .select('value').eq('post_id', postId).eq('user_id', userId).single()

  if (existing?.value === value) {
    await sb.from('votes').delete().eq('post_id', postId).eq('user_id', userId)
    return 0
  } else {
    await sb.from('votes').upsert(
      { post_id: parseInt(postId), user_id: userId, value },
      { onConflict: 'user_id,post_id' }
    )
    return value
  }
}

async function sbGetVote(postId, userId) {
  const sb = initSupabase()
  const { data } = await sb.from('votes')
    .select('value').eq('post_id', postId).eq('user_id', userId).single()
  return data?.value || 0
}

// ========== REPORTS ==========
async function sbReportPost(postId, reporterId, reason) {
  const sb = initSupabase()
  await sb.from('reports').insert({
    post_id: parseInt(postId), reporter_id: reporterId, reason
  })
}

// ========== NEWS ==========
async function sbGetCachedNews() {
  const sb = initSupabase()
  const { data } = await sb.from('news_cache')
    .select('*').order('published_at', { ascending: false }).limit(30)
  return data || []
}

async function sbFetchAndCacheNews() {
  const sb = initSupabase()
  try {
    const res = await fetch('/api/news')
    const news = await res.json()
    if (news.length > 0) {
      await sb.from('news_cache').delete().neq('id', 0)
      await sb.from('news_cache').insert(news)
    }
    return news
  } catch (e) {
    console.error('News fetch error:', e)
    return []
  }
}

// ========== MODULES (Content from data.js) ==========
async function sbSyncModulesToSupabase(modules) {
  const sb = initSupabase()
  const batchSize = 50
  for (let i = 0; i < modules.length; i += batchSize) {
    const batch = modules.slice(i, i + batchSize).map(m => ({
      title: m.title?.en || '',
      title_ar: m.title?.ar || '',
      content: m.content?.en || '',
      content_ar: m.content?.ar || '',
      domain: m.uri?.split('/').filter(Boolean)[0] || 'general',
      source_url: m.uri || '',
      is_published: true,
    }))
    await sb.from('modules').insert(batch)
  }
}

// ========== STATS ==========
async function sbGetStats() {
  const sb = initSupabase()
  const [
    { count: modules },
    { count: members },
    { count: domains },
    { count: posts },
  ] = await Promise.all([
    sb.from('modules').select('*', { count: 'exact', head: true }).eq('is_published', true),
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('modules').select('domain', { count: 'exact', head: true }),
    sb.from('forum_posts').select('*', { count: 'exact', head: true }),
  ])
  return { modules, members, domains, posts }
}
