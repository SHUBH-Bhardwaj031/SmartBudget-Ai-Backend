import { getExpenseData } from "../utils/expenseHelper.js";
import { formatISO } from "date-fns";

const getDashboardData = async (req, resp) => {
  try {
    const userId = req.userId;
    if (!userId) return resp.status(400).json({ text: "User ID missing" });

    const data = await getExpenseData(userId); // fetch all transactions

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // Filter transactions from last week
    const lastWeekTx = (data.recentTransactions ?? []).filter(
      (tx) => new Date(tx.createdAt) >= oneWeekAgo
    );

    // Total spent
    const totalForTheWeek = lastWeekTx.reduce((sum, tx) => sum + (tx.rs ?? 0), 0);

    // Daily breakdown
    const dailyBreakdown = lastWeekTx.reduce((acc, tx) => {
      const date = formatISO(new Date(tx.createdAt), { representation: "date" });
      const existing = acc.find((d) => d._id === date);
      if (existing) existing.amount += (tx.rs ?? 0);
      else acc.push({ _id: date, amount: tx.rs ?? 0 });
      return acc;
    }, []);

    // Top payment method
    const payMethodUsedBreakdown = lastWeekTx.reduce((acc, tx) => {
      const existing = acc.find((p) => p.method === tx.paymentMethod);
      if (existing) existing.amount += (tx.rs ?? 0);
      else acc.push({ method: tx.paymentMethod, amount: tx.rs ?? 0 });
      return acc;
    }, []);

    // Peak day
    const peakDayData = dailyBreakdown.reduce(
      (max, d) => (d.amount > (max?.amount ?? 0) ? d : max),
      null
    );

    resp.status(200).json({
      totalForTheWeek,
      dailyBreakdown,
      payMethodUsedBreakdown,
      peakDay: peakDayData ?? { _id: "-", amount: 0 },
      recentTransactions: data.recentTransactions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ), // full transactions for list
      lastWeekTransactions: lastWeekTx, // only last week for charts
      currency: "INR",
      headline: "Keep track of your expenses",
      tip: "Budget wisely!",
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    resp.status(500).json({ text: "⚠️ Could not generate dashboard", error: err.message });
  }
};

export default getDashboardData;
