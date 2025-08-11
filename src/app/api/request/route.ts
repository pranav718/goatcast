import { NextRequest, NextResponse } from 'next/server';
import prisma from './lib/prisma';
import { google } from 'googleapis';
import { error } from 'console';

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    ]

    for(const pattern of patterns){
        const match = url.match(pattern);
        if(match) return match[1];

    }
    return null;
}

function extractChannelHandle(url: string): string | null{
    const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^\/?\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^\/?\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^\/?\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;

}

const rateLimitStore = new Map<string,number>();

function getRateLimit(ip: string): boolean{
    const now = Date.now();
    const lastRequest = rateLimitStore.get(ip) || 0;
    const cooldown = 15000;

    if(now - lastRequest < cooldown){
        return false;
    }

    rateLimitStore.set(ip,now);
    return true;
}

export async function POST(request: NextRequest) {
  try {

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
              request.headers.get('x-real-ip') || 
              'unknown';
    
    if (!getRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait 5 minutes before submitting again.' },
        { status: 429 }
      );
    }

    const { genre, youtubeUrl, description } = await request.json();

    if (!genre || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Genre and YouTube URL are required' },
        { status: 400 }
      );
    }

    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Please provide a valid YouTube URL' },
        { status: 400 }
      );
    }

    let videoData;
    let channelData;

    const videoId = extractVideoId(youtubeUrl);
    
    if (videoId) {
      try {
        const videoResponse = await youtube.videos.list({
          part: ['snippet'],
          id: [videoId],
        });

        if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
          return NextResponse.json(
            { error: 'Video not found or private' },
            { status: 404 }
          );
        }

        videoData = videoResponse.data.items[0].snippet;
        
        const channelResponse = await youtube.channels.list({
          part: ['snippet'],
          id: [videoData!.channelId!],
        });
        
        channelData = channelResponse.data.items?.[0]?.snippet;
      } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch video information from YouTube' },
          { status: 500 }
        );
      }
    } else {

      const channelHandle = extractChannelHandle(youtubeUrl);
      
      if (!channelHandle) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL format' },
          { status: 400 }
        );
      }

      try {
        let channelResponse;
        
        if (channelHandle.startsWith('UC') || channelHandle.length === 24) {
          channelResponse = await youtube.channels.list({
            part: ['snippet'],
            id: [channelHandle],
          });
        } 
        else {

          const searchResponse = await youtube.search.list({
            part: ['snippet'],
            q: channelHandle,
            type: ['channel'],
            maxResults: 1,
          });
          
          if (searchResponse.data.items && searchResponse.data.items.length > 0) {
            const channelId = searchResponse.data.items[0].snippet?.channelId;
            if (channelId) {
              channelResponse = await youtube.channels.list({
                part: ['snippet'],
                id: [channelId],
              });
            }
          }
        }

        if (!channelResponse?.data.items || channelResponse.data.items.length === 0) {
          return NextResponse.json(
            { error: 'Channel not found' },
            { status: 404 }
          );
        }

        channelData = channelResponse.data.items[0].snippet;
      } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch channel information from YouTube' },
          { status: 500 }
        );
      }
    }

    const title = videoData?.title || channelData?.title || 'Unknown Podcast';
    const thumbnail = videoData?.thumbnails?.maxres?.url || 
                     videoData?.thumbnails?.high?.url ||
                     channelData?.thumbnails?.high?.url ||
                     channelData?.thumbnails?.default?.url ||
                     'https://via.placeholder.com/480x360';


    let genreRecord = await prisma.genre.findUnique({
      where: { slug: genre }
    });

    if (!genreRecord) {
      const genreName = genre.split('-').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      genreRecord = await prisma.genre.create({
        data: {
          name: genreName,
          slug: genre
        }
      });
    }

    const existingPodcast = await prisma.podcast.findFirst({
      where: {
        youtubeUrl: youtubeUrl,
      }
    });

    if (existingPodcast) {
      return NextResponse.json(
        { error: 'This podcast has already been submitted' },
        { status: 409 }
      );
    }

    await prisma.podcast.create({
      data: {
        title,
        description: description || videoData?.description?.substring(0, 500) || channelData?.description?.substring(0, 500) || 'No description available',
        thumbnail,
        youtubeUrl,
        genreId: genreRecord.id,
        isApproved: false, 
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Podcast added successfully!',
      title 
    });

  } catch (error) {
    
    console.error('Error creating podcast request:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}