import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';
import { sequelize } from '../models/index.js';
export const seedAll = async () => {
    try {
        console.log('\n----- STARTING SEED PROCESS -----\n');
        // Sync database first
        await sequelize.sync({ force: false });
        console.log('Database synced successfully');
        // Seed users
        await seedUsers();
        console.log('\n----- USERS SEEDED -----\n');
        // Seed tickets
        await seedTickets();
        console.log('\n----- TICKETS SEEDED -----\n');
        console.log('\n----- SEED PROCESS COMPLETED -----\n');
    }
    catch (error) {
        console.error('\n----- ERROR DURING SEEDING -----\n');
        console.error('Error seeding database:', error);
        throw error;
    }
};
// Only run if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedAll();
}
