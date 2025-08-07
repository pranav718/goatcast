'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function RequestPage() {
    const [loading, setLoading] = useState(false);
    const [succeess, setSuccess] = useState(false);

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

    
}