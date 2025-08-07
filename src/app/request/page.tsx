'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function RequestPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            genre: formData.get('genre'),
            youtubeUrl: formData.get('youtubeUrl'),
            description: formData.get('description'),
        }

        try{
            const response = await fetch('/api/podcasts/request', {
                method: 'POST',
                headers: { 'Content-Type': '/application/json'},
                body: JSON.stringify(data)
            });

            if(response.ok){
                setSuccess(true);
                (event.target as HTMLFormElement).reset();
            }

        }
        catch(error){
            console.error("Error: ", error);
        }
        finally{
            setLoading(false);
        }

    };

    return (
        <div className='min-h-screen bg-gray-50'>

        <header className='bg-white shadow-sm border-b'>
            <div className='max-w-5xl mx-auto px-8 py-8'>
                <Link href="/" className="bg-gray-800 text-white px-4 py-2 text-sm font-medium border border-gray-800 hover:bg-gray-700 transition-colors">
                    ← Back to GoatCast
                </Link>

            </div>
            
        </header>

        <main className='max-w-2xl mx-auto px-4 py-8'>
            <div className='bg-white rounded-lg shadow-md p-8'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>Request a Podcast</h1>
                <p className='text-gray-600 mb-8'>
                    Suggest some goated podcasts :D
                </p>

            {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">Thanks for the suggestion! We'll review it soon.</p>
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a genre...</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="self-improvement">Self Improvement</option>
                <option value="comedy">Comedy</option>
                <option value="health">Health & Fitness</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Channel/Video URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                required
                placeholder="https://youtube.com/@channelname or video link"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why is this podcast goated? (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Tell us what makes this podcast special..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>

            </div>
        </main>
        </div>
    )


}