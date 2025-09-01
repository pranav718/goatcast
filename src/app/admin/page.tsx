"use client"
import { useState, useEffect } from "react";
import { Podcast, Genre } from '@prisma/client';
import Link from "next/link";


type PodcastWithGenre = Podcast & {
    genre: Genre;
};

export default function AdminDashboard() {
    const [podcasts, setPodcasts] = useState<PodcastWithGenre[]>([]);
    const[loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchPendingPodcasts = async function() {
        try{
            const response = await fetch('/api/request');
            const data = await response.json();
            setPodcasts(data);
        }catch(error){
            console.error("Error fetchuong podcasts: ", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchPendingPodcasts();
    },[]);

    const handleApprove = async function (id: string) {
        setProcessingId(id);
        try{
            const response = await fetch(`/api/admin/podcasts/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'approve'})
            });

            if(response.ok){
                setPodcasts(podcasts.filter(p=>p.id !== id));
            }else{
                alert("failed tp approve podcast");
            }

        }catch(error){
            console.error("Error in approving podcast: ", error);
            alert("Error in approving podcast");
        }finally{
            setProcessingId(null);
        }
    }

    const handleReject = async function(id: string){
        setProcessingId(id);
        try{
            const response = await fetch(`/api/admin/podcasts/${id}`, {method: 'DELETE'});

            if(response.ok){
                setPodcasts(podcasts.filter(p=>p.id !== id));
            }
            else{
                alert("Failed to reject pofcast");
            }
        }catch(error){
            console.error("Error rejecting podcast: ", error);
            alert("Error rejecting podcast");
        }finally{
            setProcessingId(null);
        }
    }
    
    const handleLogout = async () => {
        await fetch('/api/auth/admin', { method: 'DELETE' });
        window.location.href = '/';
    };

    if(loading){
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-gray-600">Loading pending podcasts...</p>
            </div>
        );
    }

    return(
        <div className="min-h-screen bg-[#fafafa]">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-medium text-gray-900">Admin Dashboard</h1>
                        <Link 
                            href="/" 
                            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                        >
                            ← Back to GoatCast
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-12">
                <h2 className="text-xl font-medium text-gray-800 mb-6">
                    Pending Podcasts ({podcasts.length})
                </h2>

                {podcasts.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-8 text-center">
                        <p className="text-gray-600">No pending podcasts to review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {podcasts.map((podcast) => (
                            <div key={podcast.id} className="bg-white border border-gray-200 p-6">
                                <div className="flex gap-6">
                                    <img 
                                        src={podcast.thumbnail} 
                                        alt={podcast.title}
                                        className="w-48 h-[27] object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {podcast.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {podcast.description}
                                        </p>
                                        <div className="flex gap-4 text-sm text-gray-500 mb-4">
                                            <span>Genre: {podcast.genre.name}</span>
                                            <span>•</span>
                                            <a 
                                                href={podcast.youtubeUrl ?? undefined} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View on YouTube
                                            </a>
                                            <span>•</span>
                                            <span>
                                                Submitted: {new Date(podcast.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(podcast.id)}
                                                disabled={processingId === podcast.id}
                                                className="bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                {processingId === podcast.id ? 'Processing...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleReject(podcast.id)}
                                                disabled={processingId === podcast.id}
                                                className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}