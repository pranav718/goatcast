import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const { action } = body;

    if(action !== 'approve'){
      return NextResponse.json( {error: 'Invalid action'}, {status: 400});
    }
    
    const podcast = await prisma.podcast.update({
      where: { id: id},
      data: { isApproved: true}
    });

    return NextResponse.json({success: true, podcast});

  }
  catch(error){
    console.error("Error approving podcast: ", error);
    return NextResponse.json(
      {error: "Failed to approve podcast"},
      {status: 500}
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{id: string}>}
){
  try{
    const { id } = await params;

    await prisma.podcast.delete({where: {id: id}});
    return NextResponse.json({success: true});
  }
  catch(error){
    console.error("Error deleting podcast", error);
    return NextResponse.json(
      {error: 'Failed to delete podcast'},
      {status: 500}
    )
  };
}