// Pivot-Signal: keep-alive ping for Supabase free tier
// Free Supabase pauses after 7 days without DB activity.
// GET /.netlify/functions/health  → runs a tiny Supabase query, returns status
// Schedule this externally (e.g. cron-job.org) every 5 days to keep project alive.
// FALLBACKS: env vars in Netlify dashboard were set with placeholder text
// ({ARCHON_SECRET:...}) so we hardcode the real values here as fallback.
const SUPABASE_URL = process.env.SUPABASE_URL || 'REPLACE_IN_NETLIFY_UI';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'REPLACE_IN_NETLIFY_UI';

export default async (req) => {
  const t0 = Date.now();
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/signals?select=id&limit=1`,
      {
        headers: {
          'apikey':         SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const ms = Date.now() - t0;
    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, status: res.status, latency_ms: ms }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true, status: 'healthy', latency_ms: ms }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
