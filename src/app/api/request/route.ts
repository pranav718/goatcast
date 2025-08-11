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

export async function POST(request: NextRequest){
    
    try {
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
        
        if(!getRateLimit(ip)){
            return NextResponse.json(
                {error: "please wait 15 seconds before submitting again."},
                {status: 429}
            )
        }
        
    } catch (error) {
        console.error('Error extracting IP:', error);
    }

    const {genre, youtubeUrl, description} = await request.json();

    if(!genre || youtubeUrl) {
        return NextResponse.json(
            {error: "Genre and youtube url are required"},
            {status: 400}
        )
    }

    if(!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')){
        return NextResponse.json(
            {error: "please provide a valid youtube url"},
            {status: 400}
        )
    }

    let videoData;
    let channelData;

    const videoId = extractVideoId(youtubeUrl);

    if(videoId){
        // its a video url!!!!
        try{
            const videoResponse = await youtube.videos.list({
                part: ['snippet'],
                id: [videoId],
            })

            if(!videoResponse.data.items || videoResponse.data.items.length === 0){
                return NextResponse.json(
                    {error: "video not found or may be private :("},
                    {status: 404}
                )
            }

            videoData = videoResponse.data.items[0].snippet;

            const channelResponse = await youtube.channels.list({
                part: ['snippet'],
                id:[videoData!.channelId!]
            })

            channelData = channelResponse.data.items?.[0]?.snippet;


        }catch(error){
            console.error("yutube api error", error);
            return NextResponse.json(
                {error: "failed to fetch video information from youtube :("},
                {status: 500}
            );
        }
    }else{
        // its a  channel url!!!

        const channelHandle = extractChannelHandle(youtubeUrl);

        if(!channelHandle){
            return NextResponse.json(
                {error: "invalid url format"},
                {status: 400}
            );
        }

        try{
            let channelResponse;

            if(channelHandle.startsWith('UC') || channelHandle.length === 24){
                // its a channel id
                channelResponse = await youtube.channels.list({
                    part:['snippet'],
                    id:[channelHandle]
                });
            }else{
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

        }
        catch(error){
            console.error('YouTube API error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch channel information from YouTube' },
                { status: 500 }
            );
        }
        
    }
}
