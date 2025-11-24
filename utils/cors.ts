import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-client-info, apikey',
  'Access-Control-Max-Age': '86400',
}

export function withCors(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export function okJSON<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  })
}

export function badJSON(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: corsHeaders,
    }
  )
}

export function preflight(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}