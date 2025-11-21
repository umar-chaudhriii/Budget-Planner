const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking database connection...');
        const count = await prisma.user.count();
        console.log(`Total users: ${count}`);

        const users = await prisma.user.findMany();
        console.log('Users found:', users);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
