import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // activity, customer, general

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    // 타입별로 폴더 구분
    let subFolder = 'general';
    if (type === 'activity') {
      subFolder = 'activities';
    } else if (type === 'customer') {
      subFolder = 'customers';
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', subFolder);
    const uploadPath = join(uploadDir, fileName);

    // 디렉토리가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 이미 존재하는 경우 무시
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(uploadPath, buffer);

    return NextResponse.json({ 
      fileName,
      originalName: file.name,
      url: `/uploads/${subFolder}/${fileName}`,
      size: file.size,
      type: file.type,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}