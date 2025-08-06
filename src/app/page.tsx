import prisma from './lib/prisma';
import GenreSection from './components/GenreSection';
import Link from 'next/link';

async function getGenresWithPodcasts() {
  return await prisma.genre.findMany({
    include: {
      podcasts: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export default async function HomePage() {
  const genres = await getGenresWithPodcasts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">GoatCast</h1>
              <p className="text-gray-600 mt-1">Collection of podcasts that are just goated</p>
            </div>
            <Link 
              href="/request"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Request Podcast
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {genres.map((genre) => (
          <GenreSection key={genre.id} genre={genre} />
        ))}
      </main>
    </div>
  );
}