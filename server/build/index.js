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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../../client/dist')));
// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
// Database sync and seed
sequelize.sync({ force: false })
    .then(() => {
    console.log('Database synced successfully');
    return seedAll();
})
    .then(() => {
    console.log('Database seeded successfully');
})
    .catch((error) => {
    console.error('Error syncing database:', error);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
