import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/live\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { genre, youtubeUrl, description } = body;

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const existingPodcast = await prisma.podcast.findFirst({
      where: { videoId },
      include: { genre: true }
    })

    if(existingPodcast){
      const status = existingPodcast.isApproved ? 'approved' : 'pending approval'
      return NextResponse.json(
        {
          error: `This podcast already exists in the ${existingPodcast.genre.name} genre and is ${status}.`
        },
        {status: 409}
      )
    }

    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId]
    });

    const video = response.data.items?.[0];
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const genreRecord = await prisma.genre.findUnique({
      where: { slug: genre }
    });

    if (!genreRecord) {
      return NextResponse.json(
        { error: 'Invalid genre' },
        { status: 400 }
      );
    }

    const podcast = await prisma.podcast.create({
      data: {
        title: video.snippet?.title || 'Untitled',
        description: description || video.snippet?.description?.substring(0, 200) || '',
        thumbnail: video.snippet?.thumbnails?.maxres?.url || 
                   video.snippet?.thumbnails?.high?.url || 
                   video.snippet?.thumbnails?.default?.url || '',
        youtubeUrl: youtubeUrl,
        videoId: videoId,
        genreId: genreRecord.id,
        isApproved: false
      }
    });

    return NextResponse.json({
      success: true,
      title: podcast.title,
      message: 'Podcast submitted for review'
    });

  } catch (error) {
    console.error('Error creating podcast request:', error);
    return NextResponse.json(
      { error: 'Failed to create podcast request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {

    const podcasts = await prisma.podcast.findMany({
      where: { isApproved: false },
      include: { genre: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    );
  }
}