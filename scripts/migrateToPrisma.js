// scripts/migrateToPrisma.js
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const chalk = require('chalk'); // For colored logs

dotenv.config();

const prisma = new PrismaClient();
let migratedCount = { users: 0, todos: 0, allowances: 0 };

async function migrateCollection(model, prismaModel, name) {
  try {
    console.log(chalk.blue(`⌛ Starting ${name} migration...`));
    const docs = await model.find().lean();
    console.log(chalk.blue(`ℹ Found ${docs.length} ${name} to migrate`));

    for (const doc of docs) {
      try {
        await prisma[prismaModel].create({ data: doc });
        migratedCount[name]++;
        process.stdout.write(chalk.green(`✓ ${name} migrated: ${migratedCount[name]}\r`));
      } catch (err) {
        console.log(chalk.red(`\n⚠ Error migrating ${name} ${doc._id}: ${err.message}`));
      }
    }
    
    console.log(chalk.green(`\n✅ Successfully migrated ${migratedCount[name]} ${name}`));
  } catch (err) {
    console.log(chalk.red(`\n❌ Error during ${name} migration: ${err.message}`));
  }
}

async function runMigration() {
  try {
    // Connect to databases
    await mongoose.connect(process.env.DATABASE_URL);
    console.log(chalk.green('✔ Connected to MongoDB'));

    // Load models
    const UserModel = require('../models/User');
    const TodoModel = require('../models/Todo');
    const AllowanceModel = require('../models/Allowance');

    // Run migrations
    await migrateCollection(UserModel, 'user', 'users');
    await migrateCollection(TodoModel, 'todo', 'todos');
    await migrateCollection(AllowanceModel, 'allowance', 'allowances');

    console.log(chalk.green('\n🎉 All migrations completed successfully!'));
    console.log(chalk.blue('Summary:'));
    console.log(chalk.blue(`- Users: ${migratedCount.users}`));
    console.log(chalk.blue(`- Todos: ${migratedCount.todos}`));
    console.log(chalk.blue(`- Allowances: ${migratedCount.allowances}`));
  } catch (error) {
    console.log(chalk.red(`\n💥 Migration failed: ${error.message}`));
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
    console.log(chalk.blue('🔌 Database connections closed'));
    process.exit(0);
  }
}

runMigration();