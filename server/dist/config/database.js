import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set!');
    process.exit(1);
}
console.log('Connecting to database...');
console.log('Environment:', isProduction ? 'production' : 'development');
console.log('Database URL:', databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Log URL without credentials
const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
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
    process.exit(1);
});
export { sequelize };
