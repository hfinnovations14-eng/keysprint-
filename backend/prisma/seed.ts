import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@keysprint.io' },
    update: {},
    create: {
      email: 'admin@keysprint.io',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true,
      profile: {
        create: {
          nickname: 'SpeedMaster',
          avatarId: '👑',
          countryCode: 'US',
          bio: 'KeySprint Platform Administrator & Veteran Typist'
        }
      },
      stats: {
        create: {
          verifiedBestWpm: 145,
          avgWpm: 128,
          accuracy: 99.2,
          racesCount: 520,
          winsCount: 380,
          xp: 28500,
          level: 24,
          coins: 15000
        }
      },
      inventory: {
        create: [
          { itemId: 'blaze', itemType: 'car', isEquipped: true },
          { itemId: 'thunder', itemType: 'car', isEquipped: false }
        ]
      }
    }
  });

  console.log('✅ Admin user seeded:', adminUser.email);

  const passages = [
    {
      text: "The quick brown fox jumps over the lazy dog while high performance sports cars thunder down the championship asphalt highway at breakneck velocity.",
      difficulty: "easy",
      category: "motorsport"
    },
    {
      text: "Precision typing demands acute muscle memory, rhythmic breathing, and steadfast finger dexterity. Each sequential keystroke transforms raw thought into unstoppable kinetic momentum.",
      difficulty: "normal",
      category: "general"
    },
    {
      text: "Under the floodlights of the night circuit, neon exhaust trails illuminate the rain-soaked asphalt. Engines roar as typists worldwide push beyond the two hundred words per minute frontier.",
      difficulty: "hard",
      category: "motorsport"
    },
    {
      text: "Quantum computing introduces superposition and entanglement into information systems, vastly outpacing conventional silicon architectures in processing cryptographic algorithms.",
      difficulty: "expert",
      category: "science"
    }
  ];

  for (const p of passages) {
    const existing = await prisma.passage.findFirst({ where: { text: p.text } });
    if (!existing) {
      await prisma.passage.create({ data: p });
    }
  }
  console.log('✅ Curated passages seeded');

  const achievements = [
    { code: 'FIRST_RACE', title: 'Rookie Ignition', description: 'Complete your very first typing race on KeySprint.', badgeIcon: '🏁', xpReward: 100, coinReward: 200 },
    { code: 'SPEED_60', title: 'Sixty MPH Cruiser', description: 'Surpass 60 WPM in an official race.', badgeIcon: '⚡', xpReward: 200, coinReward: 300 },
    { code: 'SPEED_100', title: 'Triple Digit Demon', description: 'Exceed 100 WPM with at least 98% accuracy.', badgeIcon: '🚀', xpReward: 500, coinReward: 1000 },
    { code: 'PERFECT_100', title: 'Flawless Precision', description: 'Achieve a 100% flawless accuracy score in a live match.', badgeIcon: '🎯', xpReward: 400, coinReward: 600 },
    { code: 'VICTOR_PODIUM', title: 'Podium Royalty', description: 'Finish in 1st place in 10 multiplayer races.', badgeIcon: '🏆', xpReward: 1000, coinReward: 2500 }
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: {},
      create: ach
    });
  }
  console.log('✅ Achievements seeded');

  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
