import Expense from "../models/expense.js";
import mongoose from "mongoose";

export const getExpenseData = async (userId) => {
    console.log("Getting last week data");

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 6); // last 7 days including today

    console.log(userId, startDate, now);

    // Total spent this week
    const total = await Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate, $lte: now } } },
        { $group: { _id: null, total: { $sum: "$rs" } } }
    ]);

    // Previous week (for trend)
    const prevEndDate = new Date();
    prevEndDate.setDate(startDate.getDate() - 1);
    const prevStartDate = new Date();
    prevStartDate.setDate(prevEndDate.getDate() - 6);

    const totalPrev = await Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: prevStartDate, $lte: prevEndDate } } },
        { $group: { _id: null, total: { $sum: "$rs" } } }
    ]);

    // Payment method breakdown (last week)
    const payMethodUsed = await Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate, $lte: now } } },
        { $group: { _id: "$paymentMethod", amount: { $sum: "$rs" } } },
        { $sort: { amount: -1 } }
    ]);

    // Daily breakdown (last week)
    const dailyBreakdown = await Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate, $lte: now } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                amount: { $sum: "$rs" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Recent transactions (last week only)
    const recent = await Expense.find({ userId, createdAt: { $gte: startDate, $lte: now } })
        .sort({ createdAt: -1 })
        .select("title description rs createdAt paymentMethod");

    return {
        period: "Last 7 days",
        currency: "INR",
        totalForTheWeek: total[0]?.total || 0,
        totalPreviousWeek: totalPrev[0]?.total || 0,
        payMethodUsedBreakdown: payMethodUsed,
        dailyBreakdown,
        recentTransactions: recent, // last week transactions only
        weeklyBudget: 3000,
        locale: "en-IN"
    };
};
    