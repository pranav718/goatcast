'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function RequestPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const data = {
            genre: formData.get('genre'),
            youtubeUrl: formData.get('youtubeUrl'),
            description: formData.get('description'),
        }

        try{
            const response = await fetch('/api/request', {
                method: 'POST',
                headers: { 'Content-Type': '/application/json'},
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if(response.ok){
              setMessage({
                type: 'success',
                text: `${result.title} has been requested successfully`
              });
              (event.target as HTMLFormElement).reset();
            }else{
              setMessage({
                type: 'error',
                text: result.error || 'somethingg went wrong'
              });
            }

        }
        catch(error){
          setMessage({
            type: 'error',
            text: "network error. kindly check your connection"
          });
        }
        finally{
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
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Select a genre...</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="self-improvement">Self Improvement</option>
                <option value="comedy">Comedy</option>
                <option value="health">Health & Fitness</option>
                <option value="education">Education</option>
                <option value="news">News & Politics</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                required
                placeholder="https://youtube.com/@channelname or video link"
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