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
                text: `${result.title} has been added sucesfully`
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
        <div className='min-h-screen bg-gray-50'>

        <header className='bg-white border-b border-gray-200'>
            <div className='max-w-5xl mx-auto px-8 py-8'>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-medium text-gray-900 mb-2">Request a Podcast</h1>
                        <p className="text-gray-600 text-sm font-light">
                            Suggest some goated podcasts :D
                        </p>
                    </div>
                    <Link 
                        href="/"
                        className="bg-gray-800 text-white px-4 py-2 text-sm font-medium border border-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        ← Go back
                    </Link>
                </div>
            </div>
        </header>

        <main className='max-w-2xl mx-auto px-4 py-8'>
    <div className='bg-white rounded-lg shadow-md p-8'>


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
                YouTube Video URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                required
                placeholder="paste video link"
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