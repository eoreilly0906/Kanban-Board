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
    ssl: true
  } : {}
});

// Test the connection with retries
const testConnection = async (retries = 5): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) {
        console.error('Unable to connect to the database after all retries:', err);
        process.exit(1);
      }
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Test the connection
testConnection();

export { sequelize }; 