import dbConnect from '@/lib/db/connect';
import Production from '@/lib/db/models/Production';
import User from '@/lib/db/models/User';
import Machine from '@/lib/db/models/Machine';
import mongoose from 'mongoose';

export class ReportService {
  static async getSummary() {
    await dbConnect();
    
    const [productions, operators, machines] = await Promise.all([
      Production.aggregate([
        {
          $group: {
            _id: null,
            totalProductions: { $sum: 1 },
            totalWeight: { $sum: '$totalWeight' },
            totalPieces: { $sum: '$totalPieces' },
          },
        },
      ]),
      User.countDocuments({ role: 'operator', isActive: true }),
      Machine.countDocuments({ isActive: true }),
    ]);

    return {
      totalProductions: productions[0]?.totalProductions || 0,
      totalWeight: productions[0]?.totalWeight || 0,
      totalPieces: productions[0]?.totalPieces || 0,
      totalOperators: operators,
      totalMachines: machines,
    };
  }

  static async getDailyReport(date) {
    await dbConnect();
    
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const productions = await Production.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate('machineId', 'name code')
      .populate('operatorId', 'name')
      .sort({ shift: 1 })
      .lean();

    const summary = await Production.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$shift',
          totalProductions: { $sum: 1 },
          totalWeight: { $sum: '$totalWeight' },
          totalPieces: { $sum: '$totalPieces' },
        },
      },
    ]);

    return {
      date,
      productions,
      summary,
    };
  }

  static async getMachineReport(machineId, startDate, endDate) {
    await dbConnect();
    
    const productions = await Production.find({
      machineId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('operatorId', 'name')
      .sort({ date: -1 })
      .lean();

    const stats = await Production.aggregate([
      {
        $match: {
          machineId: new mongoose.Types.ObjectId(machineId),
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalProductions: { $sum: 1 },
          totalWeight: { $sum: '$totalWeight' },
          totalPieces: { $sum: '$totalPieces' },
          avgWeight: { $avg: '$totalWeight' },
        },
      },
    ]);

    return {
      machineId,
      productions,
      stats: stats[0] || {
        totalProductions: 0,
        totalWeight: 0,
        totalPieces: 0,
        avgWeight: 0,
      },
    };
  }
}
