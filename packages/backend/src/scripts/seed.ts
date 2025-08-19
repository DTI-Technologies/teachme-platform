import { seedDatabase } from '../lib/database';
import prisma from '../lib/prisma';

async function main() {
  try {
    console.log('🚀 Starting database seed...');
    
    // Check if database is connected
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Run the seeding
    await seedDatabase();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
