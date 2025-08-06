import PodcastCard from './PodcastCard';
import Link from 'next/link';

interface Podcast {
    id: string;
    title: string;
    thumbnail: string;
    youtubeUrl: string | null;  
    description: string;       
    isApproved: boolean;
    createdAt: Date;
    genreId: string;
}

interface GenreSectionProps {
    genre: {
        id: string;
        name: string;
        slug: string;
        podcasts: Podcast[];
    };
}

export default function GenreSection( {genre}: GenreSectionProps) {
    const displayPodcasts = genre.podcasts.slice(0,3);

    return (
        <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{genre.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPodcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            id={podcast.id}
            title={podcast.title}
            thumbnail={podcast.thumbnail}
            youtubeUrl={podcast.youtubeUrl || undefined}
          />
        ))}
      </div>

      {genre.podcasts.length > 3 && (
        <div className="mt-6 text-center">
          <Link 
            href={`/genre/${genre.slug}`}
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            See More {genre.name} Podcasts
          </Link>
        </div>
      )}
    </section>

    );
}