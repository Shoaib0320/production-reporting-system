# Database Seeder

Complete database seeding script for Production Reporting System.

## What Gets Seeded

### 👥 Users (8 Total)
- **2 Admins** - Full system access
- **2 Supervisors** - Production management
- **4 Operators** - Production entry

**All users have password: `abc@123`**

### 🏭 Machines (5 Total)
- Machine A1 (Cutting - Floor 1)
- Machine B2 (Molding - Floor 1)
- Machine C3 (Cutting - Floor 2)
- Machine D4 (Packaging - Floor 2)
- Machine E5 (Molding - Maintenance)

### 📊 Production Records
- Last 30 days of production data
- 2-4 entries per day
- Random but realistic data
- Various shifts (morning, evening, night)
- Mix of OK and rejected pieces

## Usage

### Run Seeder

```bash
npm run seed
```

Or directly:

```bash
node scripts/seed.js
```

### Output

The script will:
1. ✅ Connect to MongoDB
2. 🗑️ Clear existing data
3. ✅ Create users, machines, production records
4. 📧 Display all user credentials

## Default User Credentials

All passwords: **abc@123**

### Admins
- admin@example.com
- ahmed@example.com

### Supervisors
- supervisor1@example.com
- ali@example.com

### Operators
- operator1@example.com
- operator2@example.com
- hussain@example.com
- zubair@example.com

## Requirements

- MongoDB connection configured in `.env.local`
- `MONGODB_URI` environment variable set
- All dependencies installed (`npm install`)

## Notes

- ⚠️ **Clears all existing data** before seeding
- Password is hashed with bcrypt
- Production data spans last 30 days
- Realistic rejection rates (5-15%)
- Multiple shifts per day

## Troubleshooting

### Connection Error
```
❌ MongoDB Connection Error
```
**Solution:** Check `MONGODB_URI` in `.env.local`

### Module Not Found
```
Error: Cannot find module 'mongoose'
```
**Solution:** Run `npm install`

### Duplicate Key Error
```
E11000 duplicate key error
```
**Solution:** Data already exists. Script will clear it automatically on next run.

## Re-seeding

You can run the seeder multiple times. It will:
1. Delete all existing data
2. Create fresh data
3. Show new credentials

Perfect for testing and development! 🚀
