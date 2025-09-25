/**
 * Example usage of Prisma in the Bible Jot application
 * This file demonstrates how to use the database with your domain models
 */

import { prisma } from '@/infrastructure/database/prisma-client';
import { UserPostgresRepository } from '@/infrastructure/persistence/postgres/user-postgres-repository';
import { UserFactory } from '@/domain/User/user-factory';
import { Email } from '@/domain/shared/value-objects/Email';

// Example 1: Using the repository pattern
export async function createUserExample() {
  const userRepository = new UserPostgresRepository(prisma);

  // Create a new user using the domain factory
  const user = UserFactory.create({
    id: null,
    email: 'example@biblejot.com',
    username: 'exampleuser',
    firstName: 'Example',
    lastName: 'User',
    isPublic: true,
    churchId: null,
    journeySubscriptions: [],
    guideSubscriptions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Save the user through the repository
  const savedUser = await userRepository.save(user);
  console.log('Created user:', savedUser.getId());

  return savedUser;
}

// Example 2: Direct Prisma usage for complex queries
export async function findUsersWithSubscriptions() {
  const users = await prisma.user.findMany({
    include: {
      journeySubscriptions: {
        include: {
          journey: true,
        },
      },
      guideSubscriptions: {
        include: {
          guide: true,
        },
      },
      church: true,
    },
  });

  return users;
}

// Example 3: Creating related data
export async function createChurchWithUsers() {
  // Create a church
  const church = await prisma.church.create({
    data: {
      name: 'Example Church',
      address: JSON.stringify({
        street: '123 Example St',
        city: 'Example City',
        state: 'EX',
        zipCode: '12345',
        country: 'USA',
      }),
      website: 'https://examplechurch.org',
      email: 'info@examplechurch.org',
    },
  });

  // Create users associated with the church
  const user1 = await prisma.user.create({
    data: {
      email: 'member1@examplechurch.org',
      username: 'member1',
      firstName: 'John',
      lastName: 'Doe',
      churchId: church.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'member2@examplechurch.org',
      username: 'member2',
      firstName: 'Jane',
      lastName: 'Smith',
      churchId: church.id,
    },
  });

  return { church, users: [user1, user2] };
}

// Example 4: Creating a journey and subscriptions
export async function createJourneyWithSubscriptions() {
  // Create a journey
  const journey = await prisma.journey.create({
    data: {
      title: 'Daily Bible Reading',
      description: 'Read through the Bible in one year',
      content: JSON.stringify({
        duration: '365 days',
        readingPlan: 'chronological',
      }),
    },
  });

  // Get some users to subscribe
  const users = await prisma.user.findMany({ take: 2 });

  // Create subscriptions
  const subscriptions = await Promise.all(
    users.map(user =>
      prisma.journeySubscription.create({
        data: {
          userId: user.id,
          journeyId: journey.id,
        },
      })
    )
  );

  return { journey, subscriptions };
}

// Example 5: Creating Bible notes
export async function createBibleNotes() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error('No users found');

  const notes = await Promise.all([
    prisma.bibleNote.create({
      data: {
        userId: user.id,
        verse: 'John 3:16',
        content: 'For God so loved the world that he gave his one and only Son...',
        tags: ['love', 'salvation', 'gospel'],
        isPublic: true,
      },
    }),
    prisma.bibleNote.create({
      data: {
        userId: user.id,
        verse: 'Psalm 23:1',
        content: 'The Lord is my shepherd, I lack nothing.',
        tags: ['comfort', 'guidance', 'psalms'],
        isPublic: false,
      },
    }),
  ]);

  return notes;
}

// Example 6: Complex query with filtering and sorting
export async function getPublicBibleNotes() {
  const notes = await prisma.bibleNote.findMany({
    where: {
      isPublic: true,
    },
    include: {
      user: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return notes;
}

// Example 7: Using transactions
export async function createUserWithNotes() {
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        email: 'newuser@example.com',
        username: 'newuser',
        firstName: 'New',
        lastName: 'User',
      },
    });

    // Create a note for the user
    const note = await tx.bibleNote.create({
      data: {
        userId: user.id,
        verse: 'Romans 8:28',
        content: 'And we know that in all things God works for the good of those who love him...',
        tags: ['promise', 'hope', 'romans'],
        isPublic: true,
      },
    });

    return { user, note };
  });

  return result;
}

// Example usage function
export async function runExamples() {
  try {
    console.log('🚀 Running Prisma examples...');

    // Example 1: Create user
    const user = await createUserExample();
    console.log('✅ Created user:', user.getUsername());

    // Example 2: Find users with subscriptions
    const usersWithSubs = await findUsersWithSubscriptions();
    console.log('✅ Found users with subscriptions:', usersWithSubs.length);

    // Example 3: Create church with users
    const churchData = await createChurchWithUsers();
    console.log('✅ Created church with users:', churchData.church.name);

    // Example 4: Create journey with subscriptions
    const journeyData = await createJourneyWithSubscriptions();
    console.log('✅ Created journey with subscriptions:', journeyData.journey.title);

    // Example 5: Create Bible notes
    const notes = await createBibleNotes();
    console.log('✅ Created Bible notes:', notes.length);

    // Example 6: Get public notes
    const publicNotes = await getPublicBibleNotes();
    console.log('✅ Found public notes:', publicNotes.length);

    // Example 7: Transaction example
    const transactionResult = await createUserWithNotes();
    console.log('✅ Created user with note in transaction:', transactionResult.user.username);

    console.log('🎉 All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

