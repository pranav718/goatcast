import PodcastCard from "./components/PodcastCard";
import prisma from "./lib/prisma"

export default async function Home() {
  const podcasts = await prisma.podcast.findMany({
    where: {
      isApproved: true
    }
  });

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            id={podcast.id}
            title={podcast.title}
            thumbnail={podcast.thumbnail}
            youtubeUrl={podcast.youtubeUrl || undefined}
          />
        ))}
      </div>
    </div>
  );

}
