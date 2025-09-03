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
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-medium text-gray-900">GoatCast</h1>
            <nav className="flex items-center gap-6">
              <a href="#genres" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Browse
              </a>
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>
              <p className="text-sm font-medium text-gray-500 mb-4 tracking-wide uppercase">
                Welcome to GoatCast
              </p>
              <h2 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-6 leading-tight">
                Collection of podcasts that are just goated.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {totalPodcasts} and counting hand-picked podcasts.
                Just quality podcasts that are worth your time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/request"
                  className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Submit a Podcast
                </Link>
                <a 
                  href="#genres"
                  className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Start Browsing
                </a>
              </div>

              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-medium text-gray-900">{totalPodcasts}</p>
                  <p className="text-sm text-gray-500">Total Podcasts</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-gray-900">{genres.length}</p>
                  <p className="text-sm text-gray-500">Genres</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-gray-900">100%</p>
                  <p className="text-sm text-gray-500">Curated</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">// Latest additions</p>
                  {genres.slice(0, 3).map((genre) => {
                    const latestPodcast = genre.podcasts[0];
                    return latestPodcast ? (
                      <div key={genre.id}>
                        <p className="text-green-400">+ [{genre.name}]</p>
                        <p className="text-gray-300 pl-4 truncate">"{latestPodcast.title}"</p>
                      </div>
                    ) : null;
                  })}
                  <p className="text-gray-400 pt-2">// {totalPodcasts - 3} more...</p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg -z-10 blur-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      <main id="genres" className="max-w-5xl mx-auto px-8 py-16">
        {genres.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No podcasts found. Make sure to run the seed script.</p>
            <code className="bg-gray-100 px-3 py-1 text-sm font-mono">npm run seed</code>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Browse by Genre</h3>
              <p className="text-gray-600">Explore curated collection organized by category</p>
            </div>
            
            <div className="space-y-16">
              {genres.map((genre) => (
                <GenreSection key={genre.id} genre={genre} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer id="about" className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">About GoatCast</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                A curated collection of exceptional podcasts. No fluff, no filler, just good stuff.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contribute</h4>
              <p className="text-sm text-gray-600 mb-3">
                Know a goated podcast? Help us grow the collection.
              </p>
              <Link href="/request" className="text-sm text-gray-900 underline hover:no-underline">
                Request a podcast →
              </Link>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Updates</h4>
              <p className="text-sm text-gray-600">
                New podcasts added weekly. Check back often for fresh content.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Made as a first project by Knight ♡.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}