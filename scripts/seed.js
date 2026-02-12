/**
 * Database Seeder Script (ESM)
 * Run: node scripts/seed.js
 *
 * Seeds the database with users, machines and production records.
 * All users will have password: abc@123
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Import models (ensure .js extensions for ESM)
import User from '../lib/db/models/User.js';
import Machine from '../lib/db/models/Machine.js';
import Production from '../lib/db/models/Production.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Machine.deleteMany({});
    await Production.deleteMany({});
    console.log('🗑️  Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
};

// Seed Users
const seedUsers = async () => {
  const password = 'abc@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [
    // Admins
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      phone: '03001234567',
      isActive: true
    },
    {
      name: 'محمد احمد',
      email: 'ahmed@example.com',
      password: hashedPassword,
      role: 'admin',
      phone: '03001234568',
      isActive: true
    },

    // Supervisors
    {
      name: 'Supervisor One',
      email: 'supervisor1@example.com',
      password: hashedPassword,
      role: 'supervisor',
      phone: '03002234567',
      isActive: true
    },
    {
      name: 'علی حسن',
      email: 'ali@example.com',
      password: hashedPassword,
      role: 'supervisor',
      phone: '03002234568',
      isActive: true
    },

    // Operators
    {
      name: 'Operator One',
      email: 'operator1@example.com',
      password: hashedPassword,
      role: 'operator',
      phone: '03003334567',
      isActive: true
    },
    {
      name: 'Operator Two',
      email: 'operator2@example.com',
      password: hashedPassword,
      role: 'operator',
      phone: '03003334568',
      isActive: true
    },
    {
      name: 'حسین علی',
      email: 'hussain@example.com',
      password: hashedPassword,
      role: 'operator',
      phone: '03003334569',
      isActive: true
    },
    {
      name: 'زبیر احمد',
      email: 'zubair@example.com',
      password: hashedPassword,
      role: 'operator',
      phone: '03003334570',
      isActive: true
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ ${createdUsers.length} Users created`);
  return createdUsers;
};

// Seed Machines
const seedMachines = async () => {
  const machines = [
    {
      name: 'Machine A1',
      code: 'MCH-001',
      tonnage: 10,
      type: 'cutting',
      location: 'Floor 1 - Section A',
      status: 'active',
      specifications: {
        capacity: '1000 kg/hour',
        power: '15 KW',
        model: 'CUT-2024'
      }
    },
    {
      name: 'Machine B2',
      code: 'MCH-002',
      tonnage: 8,
      type: 'molding',
      location: 'Floor 1 - Section B',
      status: 'active',
      specifications: {
        capacity: '800 kg/hour',
        power: '20 KW',
        model: 'MLD-2024'
      }
    },
    {
      name: 'Machine C3',
      code: 'MCH-003',
      tonnage: 12,
      type: 'cutting',
      location: 'Floor 2 - Section A',
      status: 'active',
      specifications: {
        capacity: '1200 kg/hour',
        power: '18 KW',
        model: 'CUT-2025'
      }
    },
    {
      name: 'Machine D4',
      code: 'MCH-004',
      tonnage: 5,
      type: 'packaging',
      location: 'Floor 2 - Section C',
      status: 'active',
      specifications: {
        capacity: '500 kg/hour',
        power: '10 KW',
        model: 'PKG-2024'
      }
    },
    {
      name: 'Machine E5',
      code: 'MCH-005',
      tonnage: 9,
      type: 'molding',
      location: 'Floor 1 - Section B',
      status: 'maintenance',
      specifications: {
        capacity: '900 kg/hour',
        power: '22 KW',
        model: 'MLD-2023'
      }
    }
  ];

  const createdMachines = await Machine.insertMany(machines);
  console.log(`✅ ${createdMachines.length} Machines created`);
  return createdMachines;
};

// Seed Production Records
const seedProductions = async (users, machines) => {
  const operators = users.filter(u => u.role === 'operator');
  const productions = [];

  // Generate production records for last 30 days
  const today = new Date();
  
  for (let day = 30; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    
    // 2-4 production entries per day
    const entriesPerDay = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < entriesPerDay; i++) {
      const machine = machines[Math.floor(Math.random() * machines.length)];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      
      // Random shift
      const shifts = ['morning', 'evening', 'night'];
      const shift = shifts[Math.floor(Math.random() * shifts.length)];
      
      // Random production data
      const totalPieces = Math.floor(Math.random() * 500) + 100; // 100-600
      const pieceWeight = parseFloat((Math.random() * 2 + 0.5).toFixed(2)); // 0.5-2.5 kg
      const totalWeight = totalPieces * pieceWeight;
      // contractQuantity required by model - set as totalPieces plus small buffer
      const contractQuantity = totalPieces + Math.floor(Math.random() * 100);
      const okPieces = Math.floor(totalPieces * (0.85 + Math.random() * 0.1)); // 85-95% ok
      const rejectedPieces = totalPieces - okPieces;
      
      productions.push({
        machineId: machine._id,
        operatorId: operator._id,
        date: date,
        shift: shift,
        startTime: `${shift === 'morning' ? '08' : shift === 'evening' ? '16' : '00'}:00`,
        endTime: `${shift === 'morning' ? '16' : shift === 'evening' ? '00' : '08'}:00`,
        productName: `Product ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        batchNumber: `BATCH-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${i + 1}`,
        contractQuantity: contractQuantity,
        totalPieces: totalPieces,
        okPieces: okPieces,
        rejectedPieces: rejectedPieces,
        pieceWeight: pieceWeight,
        totalWeight: totalWeight,
        remarks: rejectedPieces > 50 ? 'High rejection rate - needs attention' : 'Normal production',
        status: 'completed'
      });
    }
  }

  const createdProductions = await Production.insertMany(productions);
  console.log(`✅ ${createdProductions.length} Production records created`);
  return createdProductions;
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    await connectDB();
    
    // Clear existing data
    await clearData();
    console.log('');

    // Seed data
    const users = await seedUsers();
    const machines = await seedMachines();
    const productions = await seedProductions(users, machines);

    console.log('\n✅ Database seeding completed successfully!\n');
    
    // Display user credentials
    console.log('📧 USER CREDENTIALS (All passwords: abc@123)\n');
    console.log('═══════════════════════════════════════════════════════════');
    
    console.log('\n👨‍💼 ADMINS:');
    users.filter(u => u.role === 'admin').forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Password: abc@123`);
      console.log('   ---');
    });

    console.log('\n👨‍🏫 SUPERVISORS:');
    users.filter(u => u.role === 'supervisor').forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Password: abc@123`);
      console.log('   ---');
    });

    console.log('\n👨‍🔧 OPERATORS:');
    users.filter(u => u.role === 'operator').forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Password: abc@123`);
      console.log('   ---');
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('\n📊 SUMMARY:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Machines: ${machines.length}`);
    console.log(`   Production Records: ${productions.length}`);
    console.log('\n🚀 You can now login with any of the above credentials!');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeder
seedDatabase();
