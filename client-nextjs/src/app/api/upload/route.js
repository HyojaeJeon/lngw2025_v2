
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    // 업로드 디렉토리가 없으면 생성
    try {
      await writeFile(path, buffer);
    } catch (error) {
      // 디렉토리가 없는 경우 생성
      const { mkdir } = await import('fs/promises');
      const uploadDir = join(process.cwd(), 'public/uploads');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path, buffer);
    }

    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url,
      message: '파일이 성공적으로 업로드되었습니다.' 
    });

  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json({ 
      error: '파일 업로드에 실패했습니다.' 
    }, { status: 500 });
  }
}
