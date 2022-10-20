import transitAggregator from "./transitAggregator";

const ALLOWED_ORIGINS = ['http://www.georgedill.net', 'https://www.georgedill.net', 'http://georgedill.net', 'https://georgedill.net', 'http://localhost:3000'];

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Max-Age': '86400',
}

addEventListener('fetch', event => {
  const request = event.request;
  switch(request.method) {
    case 'OPTIONS': 
      event.respondWith(handleOptions(request));
      break;
    case 'GET':
      event.respondWith(handleRequest(request));
      break;
    default:
      event.respondWith(new Response(null, {status: 405, statusText: 'Method Not Allowed'}));
  }
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const origin = request.headers.get('Origin');
  const url = new URL(request.url);
  
  const key = url.searchParams.get('key');
  if(key !== MY_API_KEY){
    return new Response({}, {status: 403, statusText: 'Invalid api key'});  
  }

  const schedule = await transitAggregator();
  const response = new Response(JSON.stringify(schedule));

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Content-Type', "application/json");
  return response;
}

function handleOptions(request) {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    const origin = headers.get('Origin');
    if(!ALLOWED_ORIGINS.find(x => x === origin)){
      return new Response(null, {status: 403, statusText: 'Origin not allowed'});
    }
    let respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    };
    return new Response(null, { headers: respHeaders });
  } 

  return new Response(null, {
    headers: { Allow: 'GET' }
  })

}