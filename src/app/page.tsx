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

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-6 leading-tight">
                Discover podcasts that actually matter.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Collection of {totalPodcasts} goated podcasts and counting.
                No fluff, no filler, just the good stuff.
              </p>

            </div>

            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-8 border border-gray-200">
                <div className="space-y-4">

                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="font-mono text-sm">

                    <p className="text-gray-700">const podcasts = [</p>
                    {genres.slice(0, 4).map((genre, index) => (
                      <p key={genre.id} className="text-gray-700 pl-4">
                        "{genre.name}": {genre.podcasts.length} shows{index < Math.min(genres.length - 1, 3) ? ',' : ''}
                      </p>
                    ))}
                    <p className="text-gray-700">];</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-200 rounded-lg -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-100 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <br/>
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