import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth-routes.js';
import ticketRoutes from './routes/ticket-routes.js';
import userRoutes from './routes/user-routes.js';
import { sequelize } from './config/database.js';
import { seedAll } from './seeds/index.js';
import { User } from './models/user.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use('/assets', express.static(path.join(__dirname, '../../client/dist/assets')));
// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
// Database sync and seed
const initializeDatabase = async () => {
    try {
        console.log('\n----- STARTING DATABASE INITIALIZATION -----\n');
        // Test database connection with retries
        let retries = 5;
        while (retries > 0) {
            try {
                await sequelize.authenticate();
                console.log('Database connection established successfully');
                break;
            }
            catch (error) {
                retries--;
                if (retries === 0)
                    throw error;
                console.log(`Connection attempt failed, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            }
        }
        // Sync database schema
        console.log('Syncing database schema...');
        await sequelize.sync(); // Removed force: true to prevent data loss
        console.log('Database schema synced successfully');
        // Seed database
        console.log('Starting seed process...');
        await seedAll();
        console.log('Database seeded successfully');
        // Verify seeding
        const userCount = await User.count();
        console.log(`Final user count: ${userCount}`);
        // Log seeded users
        const users = await User.findAll({
            attributes: ['id', 'username']
        });
        console.log('Seeded users:', users.map(u => u.username));
        console.log('\n----- DATABASE INITIALIZATION COMPLETED -----\n');
    }
    catch (error) {
        console.error('\n----- DATABASE INITIALIZATION ERROR -----\n');
        console.error('Error initializing database:', error);
        // Log the full error stack
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        // Exit in production if database initialization fails
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};
// Initialize database before starting the server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
