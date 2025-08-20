import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isApproved } = body;

    const podcast = await prisma.podcast.update({
      where: { id: params.id },
      data: { isApproved }
    });

    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error updating podcast:', error);
    return NextResponse.json(
      { error: 'Failed to update podcast' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.podcast.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return NextResponse.json(
      { error: 'Failed to delete podcast' },
      { status: 500 }
    );
  }
}