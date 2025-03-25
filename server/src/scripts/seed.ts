const { User } = require('../models/user');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // Check if test user exists
    const existingUser = await User.findOne({ where: { username: 'testuser' } });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'testuser',
      password: hashedPassword,
    });

    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed(); 