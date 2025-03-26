import { User } from '../models/user.js';

export const seedUsers = async () => {
  await User.bulkCreate([
    { username: 'JollyGuru', password: 'Password123' },
    { username: 'SunnyScribe', password: 'Password123' },
    { username: 'RadiantComet', password: 'Password123' },
  ], { individualHooks: true });
};
