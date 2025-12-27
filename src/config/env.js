import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  ARCJET_KEY: process.env.ARCJET_KEY,
};
