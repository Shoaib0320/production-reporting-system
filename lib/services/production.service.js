import dbConnect from '@/lib/db/connect';
import Production from '@/lib/db/models/Production';

export class ProductionService {
  static async getAll(query, user) {
    await dbConnect();
    
    const { page = 1, limit = 20, machineId, operatorId, startDate, endDate, shift } = query;
    
    let filter = {};
    
    if (machineId) filter.machineId = machineId;
    if (operatorId) filter.operatorId = operatorId;
    if (shift) filter.shift = shift;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Role-based filtering
    if (user.role === 'operator') {
      filter.operatorId = user.id;
    }

    // Supervisor should only see productions for their machines (if assigned)
    if (user.role === 'supervisor') {
      // if supervisor has machineIds, restrict to those; otherwise fall back to nothing
      const supervisor = await (await import('@/lib/db/models/User.js')).default.findById(user.id).lean();
      if (supervisor && Array.isArray(supervisor.machineIds) && supervisor.machineIds.length > 0) {
        filter.machineId = { $in: supervisor.machineIds };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [productions, total] = await Promise.all([
      Production.find(filter)
        .populate('machineId', 'name tonnage code')
        .populate('operatorId', 'name')
        .populate('supervisorId', 'name')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Production.countDocuments(filter)
    ]);

    return {
      data: productions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  static async create(data, user) {
    await dbConnect();
    
    const production = await Production.create({
      ...data,
      supervisorId: user.role === 'supervisor' ? user.id : data.supervisorId,
    });

    await production.populate('machineId', 'name tonnage code');
    await production.populate('operatorId', 'name');

    return production;
  }

  static async getById(id) {
    await dbConnect();
    
    const production = await Production.findById(id)
      .populate('machineId', 'name tonnage code')
      .populate('operatorId', 'name')
      .populate('supervisorId', 'name')
      .lean();
    
    if (!production) {
      throw new Error('Production not found');
    }
    
    return production;
  }

  static async update(id, data) {
    // now require user context to enforce permissions
    await dbConnect();
    const production = await Production.findById(id);
    if (!production) throw new Error('Production not found');

    // If supervisor, allow update only if they are the supervisor or the machine belongs to them
    if (data._user && data._user.role === 'supervisor') {
      const supId = data._user.id;
      if (!production.supervisorId || production.supervisorId.toString() !== supId) {
        // check machine assignment
        const supervisor = await (await import('@/lib/db/models/User.js')).default.findById(supId).lean();
        const machineIds = supervisor?.machineIds || [];
        if (!machineIds.find(m => m.toString() === production.machineId.toString())) {
          throw new Error('Forbidden - You cannot update this production');
        }
      }
    }

    // Perform update
    Object.assign(production, data);
    await production.save();
    await production.populate('machineId', 'name tonnage code');
    await production.populate('operatorId', 'name');
    return production.toObject();
  }

  static async delete(id) {
    await dbConnect();
    
    const production = await Production.findByIdAndDelete(id);
    if (!production) {
      throw new Error('Production not found');
    }
    
    return production;
  }
}
