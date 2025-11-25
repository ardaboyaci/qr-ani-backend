import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
}

export function preflight(origin: string | null = '*') {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*',
    },
  })
}

export function okJSON(data: any, origin: string | null = '*', init?: ResponseInit) {
  return NextResponse.json(data, {
    status: 200,
    ...init,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*',
      ...init?.headers,
    },
  })
}

export function badJSON(message: string, status: number = 400, origin: string | null = '*') {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin || '*',
      },
    }
  )
}