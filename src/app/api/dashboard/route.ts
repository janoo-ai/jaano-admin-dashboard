import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import Bot from "@/models/Bot";

interface PlanStats {
  _id: string;
  count: number;
}

export const GET = async () => {
  try {
    await connectMongo();

    const userCountsByPlan: PlanStats[] = await User.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$plan.type", "free"] },
          count: { $sum: 1 },
        },
      },
    ]);

    const allUserCount = userCountsByPlan.reduce(
      (total, item) => total + item.count,
      0
    );

    const botCount = await Bot.countDocuments();

    return NextResponse.json(
      {
        allusers: allUserCount,
        allbots: botCount,
        all_user_count_by_plan: userCountsByPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
