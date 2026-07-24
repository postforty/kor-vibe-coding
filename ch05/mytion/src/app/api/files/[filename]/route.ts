import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const documentsDir = path.join(process.cwd(), 'documents');

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = await params;
  const filePath = path.join(documentsDir, filename);

  try {
    if (!filePath.startsWith(documentsDir)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = await params;
  const filePath = path.join(documentsDir, filename);

  try {
    if (!filePath.startsWith(documentsDir)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
