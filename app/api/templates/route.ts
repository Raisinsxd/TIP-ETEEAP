import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const templatesFilePath = path.join(dataDir, 'templates.json');

// Helper to ensure directory exists
async function ensureDirExists() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
    throw new Error('Could not create data directory.');
  }
}

export async function GET() {
  try {
    await ensureDirExists(); // Ensure directory exists before reading
    const data = await fs.readFile(templatesFilePath, 'utf-8');
    const templates = JSON.parse(data);
    return NextResponse.json(templates);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array which is fine
      return NextResponse.json([]);
    }
    console.error('Error reading templates:', error);
    return NextResponse.json({ error: 'Failed to read templates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const templates = await req.json();

    // Basic validation
    if (!Array.isArray(templates)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array of templates.' }, { status: 400 });
    }

    await ensureDirExists();
    await fs.writeFile(templatesFilePath, JSON.stringify(templates, null, 2));
    
    return NextResponse.json({ message: 'Templates saved successfully' });
  } catch (error: any) {
    console.error('Error saving templates:', error);
    return NextResponse.json({ error: 'Failed to save templates' }, { status: 500 });
  }
}
