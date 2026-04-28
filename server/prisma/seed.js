const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create 3 users
  const password = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      username: 'user1',
      email: 'user1@example.com',
      password,
      name: 'User One',
      bio: 'Hello from User 1!',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      username: 'user2',
      email: 'user2@example.com',
      password,
      name: 'User Two',
      bio: 'Hello from User 2!',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'user3@example.com' },
    update: {},
    create: {
      username: 'user3',
      email: 'user3@example.com',
      password,
      name: 'User Three',
      bio: 'Hello from User 3!',
    },
  });

  // Create videos
  await prisma.video.createMany({
    data: [
      { title: 'Cool video #trending', description: 'Cool video #trending', url: '', userId: user1.id },
      { title: 'Learning to dance #fun', description: 'Learning to dance #fun', url: '', userId: user2.id },
      { title: 'Beautiful sunset #nature', description: 'Beautiful sunset #nature', url: '', userId: user3.id },
    ],
  });

  // Create follow relationships
  await prisma.follow.createMany({
    data: [
      { followerId: user1.id, followingId: user2.id },
      { followerId: user2.id, followingId: user1.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });