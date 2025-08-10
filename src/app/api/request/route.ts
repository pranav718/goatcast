import { NextRequest, NextResponse } from 'next/server';
import prisma from './lib/prisma';
import { google } from 'googleapis';

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


export async function POST(request: NextRequest){
    return NextResponse.json({message: ""});
}
