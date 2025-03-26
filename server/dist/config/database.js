import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {
    dialect: isProduction ? 'postgres' : 'sqlite',
    logging: false,
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {}
});
// Test the connection
sequelize.authenticate()
    .then(() => {
    console.log('Database connection established successfully.');
})
    .catch(err => {
    console.error('Unable to connect to the database:', err);
});
export { sequelize };
