import { PrismaClient } from '@prisma/client';

// TODO deploy

const prisma = new PrismaClient();

process.on('beforeExit', () => {
	prisma.$disconnect();
});

export { prisma };
