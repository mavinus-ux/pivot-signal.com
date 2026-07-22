// Pivot-Signal: EA → Supabase bridge
// Receives signal from MT5 EA with X-Auth-Token, forwards to Supabase.
// POST /.netlify/functions/signals  with X-Auth-Token header
export default async (req) => {
  // Only POST allowed
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { 'Allow': 'POST' } });
  }

  // Auth check
  const authToken = req.headers.get('x-auth-token');
  if (!authToken || authToken !== process.env.EA_AUTH_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse body
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Required fields
  const required = ['id', 'symbol', 'action', 'entry', 'stop_loss', 'take_profit_1', 'timeframe', 'status'];
  const missing = required.filter(f => body[f] === undefined || body[f] === null);
  if (missing.length > 0) {
    return new Response(`Missing fields: ${missing.join(', ')}`, { status: 400 });
  }

  // Action must be BUY or SELL
  if (!['BUY', 'SELL'].includes(body.action)) {
    return new Response(`Invalid action: ${body.action} (must be BUY or SELL)`, { status: 400 });
  }

  // Build signal with server-side fields
  const signal = {
    id:                 body.id,
    source:             body.source || 'mt5-ea',
    symbol:             body.symbol,
    action:             body.action,
    entry:              body.entry,
    stop_loss:          body.stop_loss,
    take_profit_1:      body.take_profit_1,
    take_profit_2:      body.take_profit_2 || null,
    timeframe:          body.timeframe,
    confidence:         body.confidence || null,
    strategy:           body.strategy || null,
    status:             body.status,
    pips:               body.pips || 0,
    created_at:         body.created_at || new Date().toISOString(),
    closed_at:          body.closed_at || null,
  };

  // POST to Supabase
  const supabaseRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/signals`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':         process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Prefer':         'return=representation',
    },
    body: JSON.stringify(signal),
  });

  if (!supabaseRes.ok) {
    const errText = await supabaseRes.text();
    return new Response(`Supabase error: ${errText}`, { status: 500 });
  }

  const data = await supabaseRes.json();
  return new Response(JSON.stringify({ ok: true, id: body.id, stored: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
