import process from 'node:process';

const endpoint = process.argv[2];
const origins = ['https://haghiweb.ir', 'https://www.haghiweb.ir'];

if (!endpoint) {
  console.error('Usage: npm run check:contact-cors -- https://your-n8n-host/webhook/hire-me');
  process.exit(1);
}

const url = new URL(endpoint);
if (url.protocol !== 'https:' || url.username || url.password) {
  throw new Error('Use an HTTPS webhook URL without embedded credentials.');
}

let failed = false;
for (const origin of origins) {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        Origin: origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
      signal: AbortSignal.timeout(10000),
    });
    const allowedOrigin = response.headers.get('access-control-allow-origin');
    const methods = (response.headers.get('access-control-allow-methods') ?? '')
      .split(',').map(value => value.trim().toUpperCase());
    const headers = (response.headers.get('access-control-allow-headers') ?? '')
      .split(',').map(value => value.trim().toLowerCase());
    const passed = response.ok && allowedOrigin === origin
      && methods.includes('POST') && headers.includes('content-type');
    failed ||= !passed;
    console.log(JSON.stringify({ origin, status: response.status, allowedOrigin, passed }));
  } catch (error) {
    failed = true;
    console.error(JSON.stringify({ origin, error: error.message, passed: false }));
  }
}

// This only checks browser preflight policy. It does not POST an inquiry or verify delivery.
process.exitCode = failed ? 1 : 0;
