import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET: string =
  process.env.JWT_SECRET || 'shopstack_super_secret_jwt_key_2026';
