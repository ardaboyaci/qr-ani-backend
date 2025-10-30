// import type { NextApiRequest, NextApiResponse } from 'next';  // <-- SİL

export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (_req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  res.status(200).json({ data: { status: 'ok', time: new Date().toISOString() } });
}
