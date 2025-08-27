const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const devAccounts = [
  {
    name: 'Alibaba User',
    email: 'alibaba@example.com',
    password: 'alibaba123',
    type: 'user'
  },
  {
    name: 'Your Boss',
    email: 'yourboss@company.com',
    password: 'yourboss123',
    type: 'employer'
  },
  {
    name: 'Admin User',
    email: 'admin@riseup.com',
    password: 'admin123',
    type: 'admin'
  }
];

async function seedDevAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing dev accounts
    await User.deleteMany({
      email: { $in: devAccounts.map(acc => acc.email) }
    });
    console.log('Cleared existing dev accounts');

    // Create new dev accounts
    for (const account of devAccounts) {
      const user = new User(account);
      await user.save();
      console.log(`Created dev account: ${account.email} (${account.type})`);
    }

    console.log('✅ Dev accounts seeded successfully!');
    console.log('\nDev Accounts:');
    devAccounts.forEach(acc => {
      console.log(`- ${acc.email} (${acc.type}) - Password: ${acc.password}`);
    });

  } catch (error) {
    console.error('Error seeding dev accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding
seedDevAccounts();
