import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const dburl = process.env.DATABASE_URL;

if (!dburl) throw new Error('DATABASE_URL is not set');

export const getDatabase = () => {
	const client = postgres(dburl);
	return drizzle(client, { schema });
};
