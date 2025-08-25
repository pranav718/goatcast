"use client"
import { useState, useEffect } from "react";
import { Podcast, Genre } from '@prisma/client'

type PodcastWithGenre = Podcast & {
    genre: Genre;
};

export default function AdminDashboard() {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
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

    if(loading){
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <p className="text-gray-600">Loading pending podcasts...</p>
            </div>
        );
    }

    return(
        <div>
            
        </div>
    )
}