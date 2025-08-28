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

export default function GenreSection({ genre }: GenreSectionProps) {
  const displayPodcasts = genre.podcasts.slice(0, 3);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{genre.name}</h2>
        {genre.podcasts.length > 3 && (
          <Link 
            href={`/genre/${genre.slug}`}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            View all →
          </Link>
        )}
      </div>
      
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
    </section>
  );
}