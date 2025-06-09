import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { cuid } from '../cuid';

export const usersTable = pgTable('user', {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	email: text(),
	name: text()
});

export const sessionsTable = pgTable('sessions', {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	userId: text().references(() => usersTable.id),
	token: text().notNull()
});

export const userIndetitiesTable = pgTable('userIdentities', {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	userId: text().references(() => usersTable.id),
	provider: text({ enum: ['zero', 'github'] }).notNull(),
	providerUserId: text().notNull(),
	createdAt: timestamp().notNull().defaultNow()
});

export const threadsTable = pgTable('threads', {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	name: text().notNull(),
	selectedModel: text(),
	userId: text().references(() => usersTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	messages: text().notNull().default('[]')
});
