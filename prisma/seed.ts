import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main(){
    const tech = await prisma.genre.create({
        data: {
            name: "Technology",
            slug: "technology",
            podcasts: {
                create: [{
                    title: "The AI breakdown",
                    description: "Best breakdown on news and insights about AI",
                    thumbnail: "https://via/placeholder.com/150",
                },
                {
                    title: "All about OSS",
                    description: "Best podcast on open-source",
                    thumbnail: "https://via.placeholder.com/150",
                }]
            }
        }
    });

    const sports = await prisma.genre.create({
        data: {
            name: "Sports",
            slug: "sports",
            podcasts: {
                create: [
                {
                    title: "Pardon My Take",
                    description: "Sports talk with a fun twist.",
                    thumbnail: "https://via.placeholder.com/150",
                },
                {
                    title: "The Bill Simmons Podcast",
                    description: "Deep sports insights and interviews.",
                    thumbnail: "https://via.placeholder.com/150",
                }]
            }
        }
    })
}