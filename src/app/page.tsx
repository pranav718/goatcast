import prisma from '../lib/prisma';
import GenreSection from './components/GenreSection';
import Link from 'next/link';

async function getGenresWithPodcasts() {
  try{
    const genres = await prisma.genre.findMany({
      include: {
        podcasts: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    return genres.filter(genre=>genre.podcasts.length > 0);
  }catch(error){
    console.log("Error ocurred: ", error);
    return[];
  };
}

export default async function HomePage() {
  const genres = await getGenresWithPodcasts();
  const totalPodcasts = genres.reduce((acc, genre) => acc + genre.podcasts.length, 0);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-2">GoatCast</h1>
              <p className="text-gray-600 text-sm font-light">
                Collection of podcasts that are just goated.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">  
              <Link 
                href="/request"
                className="bg-gray-800 text-white px-4 py-2 text-sm font-medium border border-gray-800 hover:bg-gray-700 transition-colors"
              >
                Request Podcast
              </Link>
              <Link
                href = '/admin'
                className = "bg-gray-800 text-white px-4 py-2 text-sm font-medium border border-gray-800 hover:bg-gray-700 transition-colors"
              >
                Admin
              </Link>
            </div> 
          </div>
        </div>
      </header>


      <main className="max-w-5xl mx-auto px-8 pb-12">
        {genres.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No podcasts found. Make sure to run the seed script.</p>
            <code className="bg-gray-100 px-3 py-1 text-sm border">npm run seed</code>
          </div>
        ) : (
          <div className="space-y-16">
            {genres.map((genre) => (
              <GenreSection key={genre.id} genre={genre} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}