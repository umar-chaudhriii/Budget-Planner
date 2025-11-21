const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'umar.iftikhar660@gmail.com';
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Image field type: ${typeof user.image}`);
            console.log(`Image length: ${user.image ? user.image.length : 0}`);
            if (user.image && user.image.length > 1000) {
                console.log('WARNING: Image is very large (likely base64). This breaks sessions.');
            } else {
                console.log('Image size is OK.');
            }
        } else {
            console.log('User not found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
