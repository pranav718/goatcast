"use client"

interface PodcastCardProps {
    id: string;
    title: string;
    thumbnail: string;
    youtubeUrl?: string;
}

export default function PodcastCard({ id, title, thumbnail, youtubeUrl }: PodcastCardProps){
    const handleClick = () => {
      if(youtubeUrl){
       
        const url = youtubeUrl.startsWith('http') ? youtubeUrl : `https://${youtubeUrl}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    return <div 
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
      </div>
    </div>
}