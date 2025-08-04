import { NextRequest, NextResponse } from 'next/server';
import { uploadAudioStory, uploadImageStory } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'audio' or 'image'
    const storyId = formData.get('storyId') as string;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['audio', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "audio" or "image"' },
        { status: 400 }
      );
    }

    // Use defaults if not provided
    const finalStoryId = storyId || 'temp_' + Date.now();
    const finalUserId = userId || 'anonymous';

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let result;
    
    if (type === 'audio') {
      result = await uploadAudioStory(buffer, finalStoryId, finalUserId);
    } else {
      result = await uploadImageStory(buffer, finalStoryId, finalUserId);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        // Additional metadata for auto-population
        originalName: file.name,
        originalSize: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        contentType: file.type
      },
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}