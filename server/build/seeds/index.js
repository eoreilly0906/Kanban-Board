import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';
import { sequelize } from '../models/index.js';
export const seedAll = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('\n----- DATABASE SYNCED -----\n');
        await seedUsers();
        console.log('\n----- USERS SEEDED -----\n');
        await seedTickets();
        console.log('\n----- TICKETS SEEDED -----\n');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
// Only run if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedAll();
}
