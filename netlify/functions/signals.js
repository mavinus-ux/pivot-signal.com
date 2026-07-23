// Pivot-Signal: EA → Supabase bridge
// Receives signal from MT5 EA with X-Auth-Token, forwards to Supabase.
// POST /.netlify/functions/signals  → insert new signal
// PATCH /.netlify/functions/signals → update existing signal (e.g. on close)
// Both require X-Auth-Token header matching process.env.EA_AUTH_TOKEN.
export default async (req) => {
  const authToken = req.headers.get('x-auth-token');
  if (!authToken || authToken !== process.env.EA_AUTH_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // ===== POST: insert new signal =====
  if (req.method === 'POST') {
    const required = ['id', 'symbol', 'action', 'entry', 'stop_loss', 'take_profit_1', 'timeframe', 'status'];
    const missing = required.filter(f => body[f] === undefined || body[f] === null);
    if (missing.length > 0) {
      return new Response('Missing fields: ' + missing.join(', '), { status: 400 });
    }
    if (!['BUY', 'SELL'].includes(body.action)) {
      return new Response('Invalid action: ' + body.action + ' (must be BUY or SELL)', { status: 400 });
    }

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

    const supabaseRes = await fetch(process.env.SUPABASE_URL + '/rest/v1/signals', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':         process.env.SUPABASE_SERVICE_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_KEY,
        'Prefer':         'return=representation',
      },
      body: JSON.stringify(signal),
    });

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      return new Response('Supabase error: ' + errText, { status: 500 });
    }
    return new Response(JSON.stringify({ ok: true, id: body.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ===== PATCH: update existing signal (e.g. on close) =====
  if (req.method === 'PATCH') {
    if (!body.id) {
      return new Response('Missing field: id', { status: 400 });
    }

    const updateable = ['status', 'closed_at', 'exit_price', 'pips', 'take_profit_1', 'take_profit_2', 'stop_loss', 'confidence', 'strategy'];
    const update = {};
    for (const f of updateable) {
      if (body[f] !== undefined) update[f] = body[f];
    }
    if (Object.keys(update).length === 0) {
      return new Response('No updateable fields provided', { status: 400 });
    }
    if (update.status && !['active', 'pending', 'tp1_hit', 'tp2_hit', 'tp3_hit', 'sl_hit', 'closed'].includes(update.status)) {
      return new Response('Invalid status: ' + update.status, { status: 400 });
    }

    const supabaseRes = await fetch(
      process.env.SUPABASE_URL + '/rest/v1/signals?id=eq.' + encodeURIComponent(body.id),
      {
        method: 'PATCH',
        headers: {
          'Content-Type':  'application/json',
          'apikey':         process.env.SUPABASE_SERVICE_KEY,
          'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_KEY,
          'Prefer':         'return=representation',
        },
        body: JSON.stringify(update),
      }
    );

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      return new Response('Supabase error: ' + errText, { status: 500 });
    }
    const data = await supabaseRes.json();
    return new Response(JSON.stringify({ ok: true, id: body.id, updated: data.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed (use POST or PATCH)', {
    status: 405,
    headers: { 'Allow': 'POST, PATCH' },
  });
};
