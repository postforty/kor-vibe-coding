import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const documentsDir = path.join(process.cwd(), 'documents');

async function ensureDir() {
  try {
    await fs.access(documentsDir);
  } catch {
    await fs.mkdir(documentsDir, { recursive: true });
  }
}

export async function GET() {
  await ensureDir();
  try {
    const files = await fs.readdir(documentsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    const fileStats = await Promise.all(mdFiles.map(async (file) => {
      const stats = await fs.stat(path.join(documentsDir, file));
      return {
        name: file,
        lastModified: stats.mtimeMs,
      };
    }));

    fileStats.sort((a, b) => b.lastModified - a.lastModified); // newest first
    return NextResponse.json(fileStats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureDir();
  try {
    const body = await request.json();
    const { filename, content } = body;
    
    if (!filename || content === undefined) {
      return NextResponse.json({ error: 'Missing filename or content' }, { status: 400 });
    }

    const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    const filePath = path.join(documentsDir, safeFilename);
    
    // Prevent directory traversal
    if (!filePath.startsWith(documentsDir)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    await fs.writeFile(filePath, content, 'utf-8');
    return NextResponse.json({ success: true, filename: safeFilename });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
