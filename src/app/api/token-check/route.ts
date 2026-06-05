import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ListingGate, defaultConfig } from '@hydra/listing-gate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getRpcUrl() {
  return process.env.RPC_URL ?? process.env.NEXT_PUBLIC_RPC_URL ?? '';
}

function createListingGate() {
  const rpcUrl = getRpcUrl();
  if (!rpcUrl) {
    return null;
  }
  return new ListingGate({ ...defaultConfig, rpcUrl });
}

export async function POST(req: NextRequest) {
  try {
    const gate = createListingGate();
    if (!gate) {
      return NextResponse.json({ error: 'Token check unavailable: missing RPC_URL' }, { status: 500 });
    }

    const body = await req.json();
    const { tokenAddress, chainId, pairWith } = body;
    if (!tokenAddress || !chainId) {
      return NextResponse.json({ error: 'tokenAddress and chainId required' }, { status: 400 });
    }
    const result = await gate.check({ tokenAddress, chainId, pairWith });
    return NextResponse.json(result);
  } catch (err) {
    console.error('token-check route error', err);
    return NextResponse.json({ error: 'Token check unavailable' }, { status: 500 });
  }
}
