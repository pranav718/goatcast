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
        try{
            const videoResponse = await youtube.videos.list({
                part: ['snippet'],
                id: [videoId],
            })
        }catch(error){
            console.error("yutube api error", error);
            return NextResponse.json(
                {error: "failed to fetch video information from youtube :("},
                {status: 500}
            );
        }
    }
}
