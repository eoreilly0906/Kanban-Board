import { User } from '../models/user.js';

export const seedUsers = async () => {
  try {
    console.log('Starting user seeding...');
    
    // Check if users already exist
    const existingUsers = await User.findAll();
    console.log(`Found ${existingUsers.length} existing users`);
    
    if (existingUsers.length > 0) {
      console.log('Users already exist, skipping seed');
      return;
    }

    // Create users
    const users = await User.bulkCreate([
      { username: 'JollyGuru', password: 'Password123' },
      { username: 'SunnyScribe', password: 'Password123' },
      { username: 'RadiantComet', password: 'Password123' },
    ], { 
      individualHooks: true,
      returning: true 
    });

    console.log(`Successfully created ${users.length} users`);
    console.log('Created users:', users.map(u => u.username));
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};
