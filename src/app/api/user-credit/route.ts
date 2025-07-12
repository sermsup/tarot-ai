import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), 'src', 'data', 'user-credits.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  const user = data.find((u: any) => u.email === email);
  if (!user) {
    return NextResponse.json({ credit: 0 });
  }
  return NextResponse.json({ credit: user.credit });
}

// Reduce user credit by 5
export async function POST(req: Request) {
  const { email, amount } = await req.json();
  if (!email || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Missing email or amount' }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), 'src', 'data', 'user-credits.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  const userIdx = data.findIndex((u: any) => u.email === email);
  if (userIdx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (data[userIdx].credit < amount) {
    return NextResponse.json({ error: 'Not enough credit' }, { status: 400 });
  }
  data[userIdx].credit -= amount;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return NextResponse.json({ credit: data[userIdx].credit });
}
