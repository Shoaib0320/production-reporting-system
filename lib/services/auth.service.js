import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { generateToken } from '@/lib/utils/jwt';

export class AuthService {
  static async login(email, password) {
    await dbConnect();
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('ای میل یا پاس ورڈ غلط ہے');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('ای میل یا پاس ورڈ غلط ہے');
    }
    
    if (!user.isActive) {
      throw new Error('یہ اکاؤنٹ غیر فعال ہے');
    }
    
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  static async register(userData) {
    await dbConnect();
    
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { phone: userData.phone }]
    });

    if (existingUser) {
      throw new Error('یوزر پہلے سے موجود ہے');
    }
    
    const user = await User.create(userData);
    
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  static async getCurrentUser(userId) {
    await dbConnect();
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
