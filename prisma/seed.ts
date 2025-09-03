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
            title: "DHH on the Future of Programming",
            description: "DHH discusses Rails 8, SQLite in production, and why he's bullish on monoliths.",
            thumbnail: "https://img.youtube.com/vi/vagyIcmIGOQ/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/vagyIcmIGOQ",
            videoId: "vagyIcmIGOQ",
            isApproved: true,
          },
          {
            title: "ThePrimeagen on Vim, HTMX & Being 10x",
            description: "Programming, AI, ADHD, Productivity, Addiction and God - one of Prime's best appearances.",
            thumbnail: "https://img.youtube.com/vi/tNZnLkRBYA8/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/tNZnLkRBYA8",
            videoId: "tNZnLkRBYA8",
            isApproved: true,
          },
          {
            title: "George Hotz: Hacking, Simulation, Programming",
            description: "The legendary hacker on jailbreaking, comma.ai, and the simulation hypothesis.",
            thumbnail: "https://img.youtube.com/vi/_L3gNaAVjQ4/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/_L3gNaAVjQ4",
            videoId: "_L3gNaAVjQ4",
            isApproved: true,
          },
          {
            title: "John Carmack: Doom, Quake, VR, AGI, Programming",
            description: "5 hour epic with the legendary programmer on everything from Doom to AGI.",
            thumbnail: "https://img.youtube.com/vi/I845O57ZSy4/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/I845O57ZSy4",
            videoId: "I845O57ZSy4",
            isApproved: true,
          },
          {
            title: "Linus Torvalds: Linux, Git, and C++",
            description: "The creator of Linux and Git on open source, C vs C++, and maintaining sanity.",
            thumbnail: "https://img.youtube.com/vi/o8NPllzkFhE/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/o8NPllzkFhE",
            videoId: "o8NPllzkFhE",
            isApproved: true,
          },
          {
            title: "Andrej Karpathy: Tesla Autopilot and Multi-Task Learning",
            description: "Former Tesla AI director on neural networks, autopilot, and the future of AI.",
            thumbnail: "https://img.youtube.com/vi/cdiD-9MMpb0/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/cdiD-9MMpb0",
            videoId: "cdiD-9MMpb0",
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
            title: "Mark Zuckerberg on Meta and his strategies",
            description: "",
            thumbnail: "https://img.youtube.com/vi/QciJ9ubeLQk/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/QciJ9ubeLQk?si=kF7f1yzFehg7eU4z",
            videoId: "QciJ9ubeLQk",
            isApproved: true,
          },
          {
            title: "Jeff Bezos: Amazon and Blue Origin",
            description: "The richest man discusses building Amazon, going to space, and long-term thinking.",
            thumbnail: "https://img.youtube.com/vi/DcWqzZ3I2cY/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/DcWqzZ3I2cY",
            videoId: "DcWqzZ3I2cY",
            isApproved: true,
          },
          {
            title: "Elon Musk: Neuralink, AI, Autopilot, and the Pale Blue Dot",
            description: "2+ hours with Elon on brain-computer interfaces, AI existential risk, and Mars.",
            thumbnail: "https://img.youtube.com/vi/smK9dgdTl40/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/smK9dgdTl40",
            videoId: "smK9dgdTl40",
            isApproved: true,
          },
          {
            title: "Sam Altman: OpenAI CEO on GPT-4, ChatGPT, and AGI",
            description: "The man behind ChatGPT on the path to AGI and what it means for humanity.",
            thumbnail: "https://img.youtube.com/vi/L_Guz73e6fw/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/L_Guz73e6fw",
            videoId: "L_Guz73e6fw",
            isApproved: true,
          },
          {
            title: "Jack Dorsey: Twitter, Cryptocurrency, and Corporate Activism",
            description: "Twitter founder on decentralization, Bitcoin, and the future of social media.",
            thumbnail: "https://img.youtube.com/vi/60KJz1BVTyU/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/60KJz1BVTyU",
            videoId: "60KJz1BVTyU",
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
              title: "David Goggins: How to Build Immense Inner Strength",
              description: "The hardest man alive on suffering, discipline, and becoming uncommon amongst uncommon.",
              thumbnail: "https://img.youtube.com/vi/nDLb8_wgX50/maxresdefault.jpg",
              youtubeUrl: "https://youtu.be/nDLb8_wgX50?si=UR56S9IM1UyyAUP-",
              videoId: "nDLb8_wgX50",
              isApproved: true,
          },

          {
              title: "Jordan Peterson: Life, Death, Power, Fame, and Meaning",
              description: "Clinical psychologist on responsibility, meaning, and navigating modern chaos.",
              thumbnail: "https://img.youtube.com/vi/WEP5ubPMGDU/maxresdefault.jpg",
              youtubeUrl: "https://youtu.be/WEP5ubPMGDU?si=U5jyDgWBrZx2ucX9",
              videoId: "WEP5ubPMGDU",
              isApproved: true,
          },

          {
            title: "Andrew Huberman: Neuroscience of Optimal Performance",
            description: "Stanford neuroscientist breaks down the science of peak performance and health.",
            thumbnail: "https://img.youtube.com/vi/SwQhKFMxmDY/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/SwQhKFMxmDY",
            videoId: "SwQhKFMxmDY",
            isApproved: true,
          },
          {
              title: "Jocko Willink: How to Become Resilient, Forge Your Identity",
              description: "Navy SEAL commander on extreme ownership, discipline equals freedom.",
              thumbnail: "https://img.youtube.com/vi/4W64WGFy-Js/maxresdefault.jpg",
              youtubeUrl: "https://youtu.be/4W64WGFy-Js?si=inCE96d_jcUTY7cW",
              videoId: "4W64WGFy-Js",
              isApproved: true,
          },

          {
              title: "Matthew McConaughey: Life Lessons and Greenlights",
              description: "Oscar winner on his philosophy of life, success, and finding your frequency.",
              thumbnail: "https://img.youtube.com/vi/Eu1kHIztT24/maxresdefault.jpg",
              youtubeUrl: "https://youtu.be/Eu1kHIztT24?si=TQuKwAtVeQanUQd1",
              videoId: "Eu1kHIztT24",
              isApproved: true,
          },

          {
            title: "Mike Tyson: Boxing, Ego, and God",
            description: "Iron Mike gets deep about life, death, ego, and transformation.",
            thumbnail: "https://img.youtube.com/vi/7MNv4_rTkfU/hqdefault.jpg",
            youtubeUrl: "https://www.youtube.com/live/7MNv4_rTkfU?si=L0sxxVFzLxOIgwAD",
            videoId: "7MNv4_rTkfU",
            isApproved: true,
          },
        ],
      },
    },
  });

  const science = await prisma.genre.create({
    data: {
      name: "Science",
      slug: "science",
      podcasts: {
        create: [
          {
              title: "Neil deGrasse Tyson: Black Holes, Aliens, and the Universe",
              description: "Astrophysicist on the cosmos, extraterrestrial life, and humanity's future.",
              thumbnail: "https://img.youtube.com/vi/qiP1E6iAVS8/maxresdefault.jpg",
              youtubeUrl: "https://youtu.be/qiP1E6iAVS8?si=K5exSWLqBSf16VIA",
              videoId: "qiP1E6iAVS8",
              isApproved: true,
          },
          {
              title: "Brian Cox: Black Holes, Quantum Mechanics, and Existence",
              description: "Particle physicist explains the universe in the most mind-blowing way possible.",
              thumbnail: "https://img.youtube.com/vi/Rc7OHXJtWco/maxresdefault.jpg",
              youtubeUrl: "https://youtu.be/Rc7OHXJtWco?si=B3RrA1kP8TS3y8F-",
              videoId: "Rc7OHXJtWco",
              isApproved: true,
          },
          {
            title: "Roger Penrose: Physics of Consciousness and the Infinite Universe",
            description: "Nobel laureate on consciousness, quantum mechanics, and the nature of reality.",
            thumbnail: "https://img.youtube.com/vi/orMtwOz6Db0/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/orMtwOz6Db0",
            videoId: "orMtwOz6Db0",
            isApproved: true,
          },
          {
            title: "Sean Carroll: Quantum Mechanics, Black Holes, and the Nature of Reality",
            description: "Theoretical physicist breaks down the deepest mysteries of the universe, from quantum mechanics to the arrow of time.",
            thumbnail: "https://img.youtube.com/vi/iNqqOLscOBY/maxresdefault.jpg",
            youtubeUrl: "https://youtu.be/iNqqOLscOBY",
            videoId: "iNqqOLscOBY",
            isApproved: true,
          }
        ],
      },
    },
  });

  console.log(`Seeding completed! Created ${5} genres with ${24} total podcasts.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());