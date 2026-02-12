import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export class UserService {
  static async getAll(filters = {}, user = null) {
    await dbConnect();
    
    const query = {};
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    // If supervisor, restrict to operators only
    if (user && user.role === 'supervisor') {
      query.role = 'operator';
    }
    
    const users = await User.find(query).select('-password').sort({ name: 1 }).lean();
    return users;
  }

  static async getById(id) {
    await dbConnect();
    
    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  static async create(data) {
    await dbConnect();
    
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { phone: data.phone }]
    });

    if (existingUser) {
      throw new Error('یوزر پہلے سے موجود ہے');
    }
    
    const user = await User.create(data);
    const userObj = user.toObject();
    delete userObj.password;
    
    return userObj;
  }

  static async update(id, data) {
    await dbConnect();
    
    if (data.email || data.phone) {
      const existing = await User.findOne({
        _id: { $ne: id },
        $or: [
          ...(data.email ? [{ email: data.email }] : []),
          ...(data.phone ? [{ phone: data.phone }] : []),
        ]
      });

      if (existing) {
        throw new Error('ای میل یا فون پہلے سے موجود ہے');
      }
    }
    
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select('-password').lean();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  static async delete(id) {
    await dbConnect();
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}
