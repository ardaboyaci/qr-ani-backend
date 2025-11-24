import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
}

// "origin" parametresini kabul edecek şekilde güncellendi
export function preflight(origin: string = '*') {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin,
    },
  })
}

// Data ve Origin kabul eder
export function okJSON(data: any, origin: string = '*') {
  return NextResponse.json(data, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin,
    },
  })
}

// Mesaj, Status ve Origin kabul eder (API rotaların bunu 3 parametreli kullanıyor)
export function badJSON(message: string, status: number = 400, origin: string = '*') {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin,
      },
    }
  )
} 