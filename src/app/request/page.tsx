'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [customGenreName, setCustomGenreName] = useState('');

  const predefinedGenres = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'self-improvement', label: 'Self Improvement' }
  ];

  const additionalGenres = [
    { value: 'comedy', label: 'Comedy' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'education', label: 'Education' },
    { value: 'news', label: 'News & Politics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'music', label: 'Music' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'other', label: 'Other' }
  ];

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGenre(value);
    
    const isNewGenre = additionalGenres.some(g => g.value === value);
    if (isNewGenre) {
      const genre = additionalGenres.find(g => g.value === value);
      setCustomGenreName(genre?.label || '');
    } else {
      setCustomGenreName('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      genre: selectedGenre,
      genreName: customGenreName || undefined,
      youtubeUrl: formData.get('youtubeUrl'),
      description: formData.get('description'),
    };

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: result.newGenre 
            ? `${result.title} has been requested successfully and will appear in the new "${customGenreName}" genre once approved!`
            : `${result.title} has been requested successfully`
        });
        (event.target as HTMLFormElement).reset();
        setSelectedGenre('');
        setCustomGenreName('');
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Something went wrong'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: "Network error. Please check your connection"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium text-sm">
            ← Back to GoatCast
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-12">
        <div className="bg-white border border-gray-200 p-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Request a Podcast</h1>
          <p className="text-gray-600 text-sm mb-8">
            Submit a youtube podcast video and we'll automatically fetch the details.
            <br />
            <span className="text-gray-500">
              Don't see your genre? Select it anyway, we'll create it for you!
            </span>
          </p>

          {message && (
            <div className={`border p-4 mb-6 text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              
              <select 
                  name="genre"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Select a genre...</option>
                  {[...predefinedGenres, ...additionalGenres].map(genre => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
              </select>
              
              {customGenreName && (
                <p className="mt-2 text-sm text-green-600">
                  This will create a new "{customGenreName}" genre on the homepage!
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                required
                placeholder="https://youtube.com/watch?v=... or youtu.be/..."
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How is this podcast goated? (Optional)
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="What do you find so special in this podcast?"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching from YouTube...' : 'Submit Podcast'}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}