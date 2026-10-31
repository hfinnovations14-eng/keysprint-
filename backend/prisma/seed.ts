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
      text: "Under the floodlights of the night circuit, neon exhaust trails illuminate the rain-soaked asphalt as turbocharged engines redline before the apex corner.",
      difficulty: "hard",
      category: "motorsport"
    },
    {
      text: "The human mind processes visual syntax in millisecond bursts, coordinating sensory feedback loops that synchronize twenty-six alphabetic levers into fluid, poetic motion.",
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
    { code: 'first_race', title: 'First Gear', description: 'Complete your first live typing race', badgeIcon: '🏎️', xpReward: 100, coinReward: 250 },
    { code: 'speed_demon_100', title: 'Century Club', description: 'Achieve a verified speed exceeding 100 WPM', badgeIcon: '⚡', xpReward: 500, coinReward: 1000 },
    { code: 'sharpshooter_99', title: 'Flawless Flow', description: 'Finish a race with 99% or higher accuracy', badgeIcon: '🎯', xpReward: 300, coinReward: 600 },
    { code: 'podium_master', title: 'Grand Prix Champion', description: 'Win 25 first-place podium finishes', badgeIcon: '🏆', xpReward: 1500, coinReward: 3000 }
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: {},
      create: a
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
