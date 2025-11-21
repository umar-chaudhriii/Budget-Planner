const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'umar.iftikhar660@gmail.com';
    try {
        console.log(`Clearing image for ${email}...`);
        await prisma.user.update({
            where: { email },
            data: { image: null },
        });
        console.log('Image cleared successfully!');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
