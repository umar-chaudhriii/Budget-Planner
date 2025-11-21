const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'umar.iftikhar660@gmail.com';
    const newPassword = 'password123';

    try {
        console.log(`Resetting password for ${email}...`);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        console.log('Password reset successful!');
        console.log('New password:', newPassword);
    } catch (e) {
        console.error('Error resetting password:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
