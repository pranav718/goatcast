import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

  const tech = await prisma.genre.create({
    data: {
      name: "Technology",
      slug: "technology",
      podcasts: {
        create: [
          {
            title: "Lex Fridman Podcast",
            description: "Conversations about AI, science, technology, history, philosophy and the nature of intelligence.",
            thumbnail: "https://i.ytimg.com/vi/TjQoHnL2s84/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@lexfridman",
            isApproved: true,
          },
          {
            title: "Fireship",
            description: "High-intensity code tutorials and tech news.",
            thumbnail: "https://i.ytimg.com/vi/Mus_vwhTCq0/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@Fireship",
            isApproved: true,
          },
          {
            title: "ThePrimeagen",
            description: "Programming, vim, and developer productivity.",
            thumbnail: "https://i.ytimg.com/vi/9-cyC6O81Bk/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@ThePrimeagen",
            isApproved: true,
          },
        ],
      },
    },
  });
  
  const business = await prisma.genre.create({
    data: {
      name: "Business",
      slug: "business",
      podcasts: {
        create: [
          {
            title: "My First Million",
            description: "Business ideas, trends, and entrepreneurship stories.",
            thumbnail: "https://i.ytimg.com/vi/LT_DNuYDlQE/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@myfirstmillion",
            isApproved: true,
          },
          {
            title: "Colin and Samir",
            description: "The business of being a creator.",
            thumbnail: "https://i.ytimg.com/vi/TQCKhRv72wc/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@ColinandSamir",
            isApproved: true,
          },
        ],
      },
    },
  });

  const improvement = await prisma.genre.create({
    data: {
      name: "Self Improvement",
      slug: "self-improvement",
      podcasts: {
        create: [
          {
            title: "Hamza",
            description: "Self-improvement for young men.",
            thumbnail: "https://i.ytimg.com/vi/8AuXt8M_Pjo/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@Hamza97",
            isApproved: true,
          },
          {
            title: "Jordan Peterson",
            description: "Psychology, philosophy, and life advice.",
            thumbnail: "https://i.ytimg.com/vi/kYYJlNbV1OM/maxresdefault.jpg",
            youtubeUrl: "https://www.youtube.com/@JordanBPeterson",
            isApproved: true,
          },
        ],
      },
    },
  });

  console.log("seeding completed");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());