const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('--- ALL USERS ---');
        for (const user of users) {
            console.log(`Email: ${user.email}`);
            console.log(`Hash:  ${user.password}`);

            const isMatch = await bcrypt.compare('password123', user.password);
            console.log(`Matches 'password123': ${isMatch}`);
            console.log('-------------------');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
