/**
 * Vectra Tips — Content Migration Script
 * 
 * This script migrates your existing content from data.js to Supabase.
 * 
 * HOW TO USE:
 * 1. Open index.html in your browser (via local server or Netlify)
 * 2. Open DevTools Console (F12)
 * 3. Copy-paste this entire script and press Enter
 * 4. Wait for migration to complete
 * 
 * REQUIREMENTS:
 * - Supabase project must be set up with the schema from supabase-schema.sql
 * - Your Supabase URL and Anon Key must be configured
 */

;(async function migrateToSupabase() {
  console.log('%c[OFFENSIVE TIPS] Starting migration...', 'color: #00ff41; font-weight: bold; font-size: 14px;')

  // ===== CONFIGURATION =====
  // CHANGE THESE to your Supabase project details
  const SUPABASE_URL = localStorage.getItem('supabase_url') || prompt('Enter your Supabase URL:')
  const SUPABASE_KEY = localStorage.getItem('supabase_key') || prompt('Enter your Supabase Anon Key:')
  
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('YOUR-PROJECT')) {
    console.error('%c[MIGRATION ERROR] Please configure your Supabase URL and Anon Key first!', 'color: #f85149; font-weight: bold;')
    console.log('1. Go to https://supabase.com')
    console.log('2. Create a project and copy the URL + Anon Key')
    console.log('3. Save them:')
    console.log('   localStorage.setItem("supabase_url", "https://your-project.supabase.co")')
    console.log('   localStorage.setItem("supabase_key", "eyJhbGciOiJIUzI1NiIs...")')
    return
  }

  // Save for future use
  localStorage.setItem('supabase_url', SUPABASE_URL)
  localStorage.setItem('supabase_key', SUPABASE_KEY)

  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

  // Check if data exists
  if (typeof siteData === 'undefined' || !siteData.length) {
    console.error('%c[MIGRATION ERROR] siteData not found! Make sure data.js is loaded.', 'color: #f85149; font-weight: bold;')
    return
  }

  console.log(`%c[MIGRATION] Found ${siteData.length} modules to migrate...`, 'color: #00ff41;')

  // Process in batches of 20
  const BATCH_SIZE = 20
  let migrated = 0
  let errors = 0

  for (let i = 0; i < siteData.length; i += BATCH_SIZE) {
    const batch = siteData.slice(i, i + BATCH_SIZE)
    
    const records = batch.map(item => {
      const uriParts = item.uri.split('/').filter(Boolean)
      return {
        title: item.title?.en || '',
        title_ar: item.title?.ar || '',
        content: item.content?.en || '',
        content_ar: item.content?.ar || '',
        domain: uriParts[0] || 'general',
        source_url: item.uri || '',
        is_published: true,
      }
    })

    const { error } = await sb.from('modules').insert(records)
    
    if (error) {
      console.error(`%c[MIGRATION ERROR] Batch ${i / BATCH_SIZE + 1}:`, 'color: #f85149;', error.message)
      errors += batch.length
    } else {
      migrated += batch.length
      console.log(`%c[MIGRATION] ✓ Migrated ${migrated}/${siteData.length} modules`, 'color: #00ff41;')
    }
  }

  console.log(`%c═══════════════════════════════════════`, 'color: #00ff41;')
  console.log(`%c[MIGRATION COMPLETE]`, 'color: #00ff41; font-weight: bold; font-size: 16px;')
  console.log(`%c  ✓ Total: ${siteData.length} modules`, 'color: #00ff41;')
  console.log(`%c  ✓ Migrated: ${migrated}`, 'color: #00ff41;')
  console.log(`%c  ✗ Errors: ${errors}`, errors > 0 ? 'color: #f85149;' : 'color: #00ff41;')
  console.log(`%c═══════════════════════════════════════`, 'color: #00ff41;')
  console.log('')
  console.log('%cNext steps:', 'color: #888; font-size: 13px;')
  console.log('1. Go to your Supabase Dashboard → Table Editor')
  console.log('2. Open the "modules" table')
  console.log('3. Verify your data is there')
  console.log('4. Now the Forum, Profiles, and News features will work!')
})()
