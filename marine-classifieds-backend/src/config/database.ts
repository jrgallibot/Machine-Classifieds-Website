import { ConnectionOptions } from 'typeorm';
import { User } from '../entities/User';
import { Listing } from '../entities/Listing';
import { Category } from '../entities/Category';
import { Message } from '../entities/Message';
import { Payment } from '../entities/Payment';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'marine_classifieds',
  entities: [User, Listing, Category, Message, Payment],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

export default config; 