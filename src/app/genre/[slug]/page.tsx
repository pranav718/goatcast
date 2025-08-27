import prisma from '@/lib/prisma';
import PodcastCard from '@/app/components/PodcastCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getGenreWithPodcasts(slug: string){
    try{
        const genre = await prisma.genre.findUnique({
            where: { slug },
            include: {
                podcasts: {
                    where: { isApproved: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return genre;
        
    }catch(error){
        console.error('Error fetching genre: ', error);
        return null;
    }
}

export default async function GenrePage( { params }: { params: { slug: string } }){
    const genre = await getGenreWithPodcasts(params.slug);

    if(!genre){
        notFound();
    }

    return (
        <div>
            
        </div>
    )
}