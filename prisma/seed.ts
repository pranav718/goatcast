import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

  await prisma.podcast.deleteMany({});
  await prisma.genre.deleteMany({});

  const tech = await prisma.genre.create({
    data: {
      name: "Technology",
      slug: "technology",
      podcasts: {
        create: [
          {
            title: "DHH",
            description: "Future of programming,ai,etc.",
            thumbnail: "https://img.youtube.com/vi/vagyIcmIGOQ/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/vagyIcmIGOQ?si=aOR3CXv6RQAsCAxI",
            videoId: "vagyIcmIGOQ",
            isApproved: true,
          },
          {
            title: "Primeagen",
            description: "Programming, AI, ADHD, Productivity, Addiction and God.",
            thumbnail: "https://img.youtube.com/vi/tNZnLkRBYA8/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/tNZnLkRBYA8?si=3Sn8W_6HUxZzYzHb",
            videoId: "tNZnLkRBYA8",
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
            title: "Mark Zuckerberg",
            description: "Business ideas, trends, and entrepreneurship stories.",
            thumbnail: "https://img.youtube.com/vi/7k1ehaE0bdU/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/7k1ehaE0bdU?si=wf0BqGaQvkM-Tsrp",
            videoId: "7k1ehaE0bdU",
            isApproved: true,
          },
          {
            title: "Jeff Bezos",
            description: "Amazon and Blue Origin.",
            thumbnail: "https://img.youtube.com/vi/DcWqzZ3I2cY/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/DcWqzZ3I2cY?si=y8eACjsgOcT8vGG7",
            videoId: "DcWqzZ3I2cY",
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
            title: "David Goggins",
            description: "One of the best podcast of David Goggins",
            thumbnail: "https://i.ytimg.com/vi/5tSTk1083VY/sddefault.jpg",
            youtubeUrl: "https://www.youtube.com/live/5tSTk1083VY?si=wWU2HKFXfjdub-bo",
            videoId: "5tSTk1083VY",
            isApproved: true,
          },
          {
            title: "Jordan Peterson",
            description: "Psychology, philosophy, and life advice.",
            thumbnail: "https://img.youtube.com/vi/WEP5ubPMGDU/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/WEP5ubPMGDU?si=18XjVGxtzi6IkEV1",
            videoId: "WEP5ubPMGDU",
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