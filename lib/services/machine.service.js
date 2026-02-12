import dbConnect from '@/lib/db/connect';
import Machine from '@/lib/db/models/Machine';

export class MachineService {
  static async getAll(filters = {}) {
    await dbConnect();
    
    const query = {};
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    const machines = await Machine.find(query).sort({ name: 1 }).lean();
    return machines;
  }

  static async getById(id) {
    await dbConnect();
    
    const machine = await Machine.findById(id).lean();
    if (!machine) {
      throw new Error('Machine not found');
    }
    
    return machine;
  }

  static async create(data) {
    await dbConnect();
    
    const existingMachine = await Machine.findOne({ code: data.code.toUpperCase() });
    if (existingMachine) {
      throw new Error('مشین کوڈ پہلے سے موجود ہے');
    }
    
    const machine = await Machine.create(data);
    return machine;
  }

  static async update(id, data) {
    await dbConnect();
    
    if (data.code) {
      const existing = await Machine.findOne({ code: data.code.toUpperCase(), _id: { $ne: id } });
      if (existing) {
        throw new Error('مشین کوڈ پہلے سے موجود ہے');
      }
    }
    
    const machine = await Machine.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    
    if (!machine) {
      throw new Error('Machine not found');
    }
    
    return machine;
  }

  static async delete(id) {
    await dbConnect();
    
    const machine = await Machine.findByIdAndDelete(id);
    if (!machine) {
      throw new Error('Machine not found');
    }
    
    return machine;
  }
}
