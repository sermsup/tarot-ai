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
