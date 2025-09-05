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

export default async function GenrePage( { params }: { params: Promise<{ slug: string }> }){
    const promisedParams = await params;
    const genre = await getGenreWithPodcasts(promisedParams.slug);

    if(!genre){
        notFound();
    }

    return (
        <div className= 'min-h-screen bg-[#fafafa]'>
            <header className='bg-white border-b border-gray-200'>
                <div className='max-w-5xl mx-auto px-8 py-6'>
                    <Link
                        href='/' className='text-gray-600 hover:text-gray-800 font-medium text-sm'
                    >
                        ← Back to GoatCast
                    </Link>
                </div>
            </header>

            <main className='max-w-5xl mx-auto px-8 py-12'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-medium text-gray-900 mb-2'>{genre.name} Podcasts</h1>
                    <div className='text-gray-600 text-sm'>{genre.podcasts.length} podcast{genre.podcasts.length == 1 ? '' : 's'} in this genre</div>
                </div>

                {genre.podcasts.length == 0 ? (
                    <div className='bg-white border border-gray-200 p-8 text-center text-gray-600'>
                        No podcasts in this genre yet.
                    </div>
                ): (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {genre.podcasts.map((podcast) => 
                            <PodcastCard
                                key = {podcast.id}
                                id = {podcast.id}
                                title = { podcast.title}
                                thumbnail = {podcast.thumbnail}
                                youtubeUrl = {podcast.youtubeUrl || undefined}
                                />
                            )}
                    </div>
                )}
            </main>

        </div>
    )
}